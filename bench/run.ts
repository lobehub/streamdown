import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { cpus } from 'node:os';
import path from 'node:path';
import { parseArgs } from 'node:util';

import { chromium } from 'playwright';
import { build } from 'vite';

import type { ReplayResult } from './pages/harness.ts';

const root = path.resolve(import.meta.dirname, '..');
const cache = path.join(root, 'bench/.cache');

const FIXTURE_COMMIT = 'b049b9ee1c074351a57af3815024dfe504224bbf';
const FIXTURE_REPO = 'https://github.com/pierrecomputer/pierre.git';
const FIXTURE_PATH = 'packages/words/benchmark/fixtures';
const ALL_FIXTURES = [
  'tiny.md',
  'assistant-review.md',
  'assistant-explain.md',
  'simd.md',
  'gfm-spec.md',
];
const DEFAULT_FIXTURES = ['tiny.md', 'assistant-review.md', 'assistant-explain.md'];

const SCENARIOS = {
  burst: { chunk: 256, interval: 40 },
  llm: { chunk: 24, interval: 50 },
} as const;

const ENGINES = {
  'lobe-char': {
    modes: ['animated'],
    page: 'lobe',
    query: 'granularity=char&smoothing=balanced',
  },
  'lobe-realtime': {
    modes: ['animated'],
    page: 'lobe',
    query: 'granularity=word&smoothing=realtime',
  },
  'lobe-word': {
    modes: ['animated'],
    page: 'lobe',
    query: 'granularity=word&smoothing=balanced',
  },
  vercel: { modes: ['plain', 'animated'], page: 'vercel', query: '' },
  words: { modes: ['plain', 'animated'], page: 'words', query: '' },
} as const;
type Engine = keyof typeof ENGINES;

const { values: flags } = parseArgs({
  options: {
    engines: { default: 'words,vercel,lobe-char,lobe-word', type: 'string' },
    fixture: { type: 'string' },
    json: { type: 'string' },
    mode: { type: 'string' },
    runs: { default: '3', type: 'string' },
    scenario: { default: 'burst,llm', type: 'string' },
    throttle: { default: '1', type: 'string' },
  },
});

const engines = flags.engines.split(',') as Engine[];
for (const engine of engines) assert.ok(engine in ENGINES, `unknown engine ${engine}`);
const scenarios = flags.scenario.split(',') as (keyof typeof SCENARIOS)[];
for (const scenario of scenarios) assert.ok(scenario in SCENARIOS, `unknown scenario ${scenario}`);
const runs = Number(flags.runs);
assert.ok(Number.isSafeInteger(runs) && runs > 0, '--runs must be a positive integer');
const fixtureNames = flags.fixture ? flags.fixture.split(',') : DEFAULT_FIXTURES;
const isGenerated = (name: string) => /^gen-(paragraph|fence)-\d+$/.test(name);
for (const name of fixtureNames) {
  assert.ok(ALL_FIXTURES.includes(name) || isGenerated(name), `unknown fixture ${name}`);
}
const throttle = Number(flags.throttle);
assert.ok(Number.isFinite(throttle) && throttle >= 1, '--throttle must be >= 1');

const checkout = path.join(cache, 'pierre');
const fixtureDir = path.join(checkout, FIXTURE_PATH);
if (!fixtureNames.every((name) => isGenerated(name) || existsSync(path.join(fixtureDir, name)))) {
  mkdirSync(cache, { recursive: true });
  const git = (args: string) => execSync(`git ${args}`, { cwd: checkout, stdio: 'inherit' });
  if (!existsSync(checkout)) {
    execSync(`git clone --filter=blob:none --no-checkout --sparse ${FIXTURE_REPO} ${checkout}`, {
      stdio: 'inherit',
    });
  }
  git(`sparse-checkout set ${FIXTURE_PATH}`);
  git(`checkout --detach ${FIXTURE_COMMIT}`);
}

const distDir = path.join(cache, 'dist');
const pagesDir = path.join(root, 'bench/pages');
await build({
  base: './',
  build: {
    emptyOutDir: true,
    outDir: distDir,
    rollupOptions: {
      input: Object.fromEntries(
        ['lobe', 'words', 'vercel'].map((page) => [page, path.join(pagesDir, `${page}.html`)]),
      ),
    },
    target: 'es2022',
  },
  configFile: false,
  logLevel: 'warn',
  mode: 'production',
  resolve: {
    alias: [{ find: /^@lobehub\/streamdown$/, replacement: path.join(root, 'src') }],
  },
  root: pagesDir,
});

const MIME: Record<string, string> = {
  '.css': 'text/css',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.md': 'text/markdown; charset=utf-8',
  '.wasm': 'application/wasm',
};

const serve = (pathname: string) => {
  const filePath = pathname.startsWith('/fixtures/')
    ? path.join(fixtureDir, pathname.slice('/fixtures/'.length))
    : path.join(distDir, pathname);
  if (!filePath.startsWith(cache) || !existsSync(filePath)) return;
  return {
    body: readFileSync(filePath),
    contentType: MIME[path.extname(filePath)] ?? 'application/octet-stream',
  };
};

const median = (values: number[]) => {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = sorted.length >> 1;
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
};
const p95 = (values: number[]) => {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.ceil(sorted.length * 0.95) - 1)] ?? 0;
};
const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);
const round = (value: number) => Math.round(value * 10) / 10;

const within = async <T>(promise: Promise<T>, ms: number, message: string): Promise<T> => {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error(message)), ms);
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
};

const METRICS = [
  'TaskDuration',
  'ScriptDuration',
  'LayoutDuration',
  'RecalcStyleDuration',
] as const;

let browserVersion = '';

async function replay(
  engine: Engine,
  fixture: string,
  mode: string,
  scenario: keyof typeof SCENARIOS,
) {
  const { page: pageName, query } = ENGINES[engine];
  const { chunk, interval } = SCENARIOS[scenario];
  const browser = await chromium.launch({ channel: 'chrome' });
  try {
    browserVersion = browser.version();
    const page = await browser.newPage({
      viewport: { height: 960, width: 1280 },
    });
    await page.route('http://bench.local/**', (route) => {
      const file = serve(new URL(route.request().url()).pathname);
      return file ? route.fulfill(file) : route.fulfill({ status: 404 });
    });
    page.on('pageerror', (error) => console.error(`[${engine}] pageerror: ${error.message}`));
    page.on('console', (message) => {
      if (message.type() === 'error') console.error(`[${engine}] console: ${message.text()}`);
    });
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Performance.enable');
    const metrics = async () => {
      const { metrics: list } = await cdp.send('Performance.getMetrics');
      return Object.fromEntries(list.map(({ name, value }) => [name, value]));
    };
    const heap = async () => {
      await cdp.send('HeapProfiler.collectGarbage');
      await cdp.send('HeapProfiler.collectGarbage');
      return (await cdp.send('Runtime.getHeapUsage')).usedSize;
    };
    const search = new URLSearchParams({
      chunk: String(chunk),
      fixture,
      interval: String(interval),
      mode,
    });
    await page.goto(`http://bench.local/${pageName}.html?${search}&${query}`);
    await page.waitForFunction('window.bench !== undefined', undefined, {
      timeout: 30_000,
    });
    await within(page.evaluate('bench.ready'), 30_000, `${engine}: warmup did not settle`);
    if (throttle > 1) await cdp.send('Emulation.setCPUThrottlingRate', { rate: throttle });
    const baselineHeap = await heap();
    const before = await metrics();
    const result = await within(
      page.evaluate<ReplayResult>('bench.run()'),
      600_000,
      `${engine} ${fixture}: replay timed out`,
    );
    const after = await metrics();
    const cpu = Object.fromEntries(
      METRICS.map((name) => [name, round(((after[name] ?? 0) - (before[name] ?? 0)) * 1000)]),
    ) as Record<(typeof METRICS)[number], number>;
    return {
      ...result,
      cpu,
      frameP95Ms: p95(result.frames),
      heapBytes: (await heap()) - baselineHeap,
      longFrames: result.frames.filter((value) => value > 50).length,
      updateP95Ms: p95(result.updates),
      updateTotalMs: round(sum(result.updates)),
    };
  } finally {
    await browser.close();
  }
}

type Record_ = Awaited<ReturnType<typeof replay>> & {
  engine: Engine;
  fixture: string;
  mode: string;
  run: number;
  scenario: string;
};
const records: Record_[] = [];
const cases = scenarios.flatMap((scenario) =>
  fixtureNames.flatMap((fixture) =>
    ['plain', 'animated']
      .filter((mode) => !flags.mode || flags.mode === mode)
      .map((mode) => ({ fixture, mode, scenario })),
  ),
);

const expected = new Map<string, Record_>();
for (const { fixture, mode, scenario } of cases) {
  const active = engines.filter((engine) =>
    (ENGINES[engine].modes as readonly string[]).includes(mode),
  );
  for (let run = 0; run < runs; run++) {
    for (const engine of run % 2 === 0 ? active : [...active].reverse()) {
      const label = `${engine} ${scenario} ${fixture} ${mode} #${run + 1}`;
      const result = await replay(engine, fixture, mode, scenario as keyof typeof SCENARIOS);
      const record = { ...result, engine, fixture, mode, run, scenario };
      assert.deepEqual(result.errors, [], label);
      const key = `${engine} ${fixture}`;
      const first = expected.get(key) ?? record;
      expected.set(key, first);
      assert.equal(result.textHash, first.textHash, `${label}: final text differs between runs`);
      console.info(
        `${label}: cpu ${result.cpu.TaskDuration} ms, script ${result.cpu.ScriptDuration} ms, updates ${result.updateTotalMs} ms, settled ${result.settledMs} ms, frame p95 ${result.frameP95Ms} ms, heap +${(result.heapBytes / 1e6).toFixed(1)} MB`,
      );
      records.push(record);
    }
  }
}

const rows = cases.flatMap(({ fixture, mode, scenario }) =>
  engines
    .map((engine) => {
      const done = records.filter(
        (record) =>
          record.engine === engine &&
          record.fixture === fixture &&
          record.mode === mode &&
          record.scenario === scenario,
      );
      if (done.length === 0) return;
      const pick = (read: (record: Record_) => number) => round(median(done.map(read)));
      return {
        cpu: pick((record) => record.cpu.TaskDuration),
        elements: pick((record) => record.elements),
        engine,
        fixture,
        frameP95: pick((record) => record.frameP95Ms),
        heapMB: round(median(done.map((record) => record.heapBytes)) / 1e6),
        layoutStyle: pick((record) => record.cpu.LayoutDuration + record.cpu.RecalcStyleDuration),
        longFrames: pick((record) => record.longFrames),
        mode,
        scenario,
        script: pick((record) => record.cpu.ScriptDuration),
        settled: pick((record) => record.settledMs),
        streamed: pick((record) => record.completedMs),
        text: pick((record) => record.textLength),
        updateP95: pick((record) => record.updateP95Ms),
        updateTotal: pick((record) => record.updateTotalMs),
      };
    })
    .filter((row) => row !== undefined),
);

const columns = [
  ['scenario', 'scenario'],
  ['fixture', 'fixture'],
  ['mode', 'mode'],
  ['engine', 'engine'],
  ['cpu', 'main thread ms'],
  ['script', 'script ms'],
  ['layoutStyle', 'layout+style ms'],
  ['updateTotal', 'update total ms'],
  ['updateP95', 'update p95 ms'],
  ['frameP95', 'frame p95 ms'],
  ['longFrames', 'frames >50ms'],
  ['streamed', 'stream ms'],
  ['settled', 'settled ms'],
  ['heapMB', 'heap MB'],
  ['elements', 'DOM elements'],
  ['text', 'text chars'],
] as const;
const table = [
  `| ${columns.map(([, title]) => title).join(' | ')} |`,
  `| ${columns.map(([key]) => (typeof rows[0]?.[key] === 'number' ? '--:' : '---')).join(' | ')} |`,
  ...rows.map((row) => `| ${columns.map(([key]) => row[key]).join(' | ')} |`),
].join('\n');

const environment = {
  browser: browserVersion,
  commit: execSync('git rev-parse --short HEAD', { cwd: root }).toString().trim(),
  cpu: cpus()[0]?.model,
  date: new Date().toISOString(),
  dirty: execSync('git status --porcelain', { cwd: root }).toString().trim() !== '',
  node: process.version,
  runs,
  throttle,
  scenarios: Object.fromEntries(scenarios.map((name) => [name, SCENARIOS[name]])),
};
console.info(`\n${JSON.stringify(environment)}\n\n${table}`);
if (flags.json) writeFileSync(flags.json, JSON.stringify({ environment, records, rows }, null, 2));

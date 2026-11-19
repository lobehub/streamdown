import { createElement, type ReactElement, useEffect, useLayoutEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

export interface RendererProps {
  active: boolean;
  animated: boolean;
  value: string;
}

export interface ReplayResult {
  completedMs: number;
  elements: number;
  errors: string[];
  fences: number;
  frames: number[];
  paragraphs: number;
  settledMs: number;
  textHash: string;
  textLength: number;
  updates: number[];
}

const params = new URLSearchParams(location.search);
const fixture = params.get('fixture')!;
const chunk = Number(params.get('chunk'));
const interval = Number(params.get('interval'));
const animated = params.get('mode') === 'animated';

const errors: string[] = [];
window.addEventListener('error', (event) => errors.push(event.message));
window.addEventListener('unhandledrejection', (event) => errors.push(String(event.reason)));

const generate = (name: string) => {
  const [, kind, size] = /^gen-(paragraph|fence)-(\d+)$/.exec(name) ?? [];
  if (!kind) return;
  const line =
    kind === 'fence'
      ? 'const value = "<&>"; // é 中, ordinary code\n'
      : 'Ordinary prose, with words and numbers 12345. ';
  const body = line.repeat(Math.ceil(Number(size) / line.length)).slice(0, Number(size));
  return kind === 'fence' ? `\`\`\`typescript\n${body}\n\`\`\`\n` : `${body}\n\n`;
};

const source = generate(fixture) ?? (await (await fetch(`/fixtures/${fixture}`)).text());
const ends: number[] = [];
for (let end = 0; end < source.length;) {
  end = Math.min(end + chunk, source.length);
  const code = source.charCodeAt(end - 1);
  if (code >= 0xD800 && code <= 0xDBFF && end < source.length) end++;
  ends.push(end);
}

const warmupSource = [
  'Warmup **formatting**, *emphasis*, `code` and [navigation](/warmup).',
  '- one\n- two',
  '| a | b |\n| - | - |\n| 1 | 2 |',
  '> quote',
  '```ts\nconst warmup = 1;\n```',
].join('\n\n');

const normalize = (text: string) => text.replaceAll(/\s+/g, '');

const hash = (text: string) => {
  let value = 2_166_136_261;
  for (let i = 0; i < text.length; i++)
    value = Math.imul(value ^ text.charCodeAt(i), 16_777_619) >>> 0;
  return value.toString(16);
};

let markReady!: () => void;
let play!: (done: (result: ReplayResult) => void) => void;
Object.assign(window, {
  bench: {
    ready: new Promise<void>((resolve) => (markReady = resolve)),
    run: () => new Promise<ReplayResult>((resolve) => play(resolve)),
  },
});

const waitForSettle = (preview: HTMLElement, since: number) =>
  new Promise<number>((resolve) => {
    let lastText = '';
    let stableSince = performance.now();
    const timer = setInterval(() => {
      const now = performance.now();
      const text = normalize(preview.textContent ?? '');
      const animating = document
        .getAnimations()
        .some((animation) => animation.playState === 'running');
      if (text !== lastText || animating) {
        lastText = text;
        stableSince = now;
        return;
      }
      if (now - stableSince < 400 || now - since < 400) return;
      clearInterval(timer);
      resolve(stableSince);
    }, 20);
  });

export function mount(Renderer: (props: RendererProps) => ReactElement): void {
  const updates: number[] = [];
  const frames: number[] = [];
  let requested = 0;
  let startedAt = 0;
  let completedAt = 0;
  let finished = false;
  let done: (result: ReplayResult) => void;

  function App() {
    const [stage, setStage] = useState<'warmup' | 'idle' | 'playing'>('warmup');
    const [step, setStep] = useState(0);
    const cursor = step === 0 ? 0 : ends[step - 1];

    useEffect(() => {
      play = (resolve) => {
        done = resolve;
        let previous = performance.now();
        const frame = (now: number) => {
          if (finished) return;
          frames.push(Math.round((now - previous) * 10) / 10);
          previous = now;
          requestAnimationFrame(frame);
        };
        requestAnimationFrame(frame);
        startedAt = performance.now();
        setStage('playing');
      };
      const preview = document.querySelector<HTMLElement>('#preview')!;
      void waitForSettle(preview, performance.now()).then(() => setStage('idle'));
    }, []);

    useLayoutEffect(() => {
      if (stage === 'idle') requestAnimationFrame(() => requestAnimationFrame(markReady));
      if (stage !== 'playing' || step === 0) return;
      updates.push(Math.round((performance.now() - requested) * 10) / 10);
      if (step === ends.length) completedAt = performance.now();
    }, [stage, step]);

    useEffect(() => {
      if (stage !== 'playing') return;
      if (step < ends.length) {
        const timer = setTimeout(() => {
          requested = performance.now();
          setStep(step + 1);
        }, interval);
        return () => clearTimeout(timer);
      }
      const preview = document.querySelector<HTMLElement>('#preview')!;
      void waitForSettle(preview, completedAt).then((settledAt) => {
        finished = true;
        const paragraphs = [...preview.querySelectorAll('p')];
        const fences = [...preview.querySelectorAll('pre code')];
        const text = normalize(preview.textContent ?? '');
        done({
          completedMs: Math.round(completedAt - startedAt),
          elements: preview.getElementsByTagName('*').length,
          errors,
          fences: fences.length,
          frames,
          paragraphs: paragraphs.length,
          settledMs: Math.round(settledAt - startedAt),
          textHash: hash(text),
          textLength: text.length,
          updates,
        });
      });
    }, [stage, step]);

    return createElement(
      'main',
      { id: 'preview' },
      createElement(Renderer, {
        active: stage === 'playing' && step < ends.length,
        animated,
        key: stage === 'warmup' ? 0 : 1,
        value: stage === 'warmup' ? warmupSource : source.slice(0, cursor),
      }),
    );
  }

  createRoot(document.querySelector('#app')!).render(createElement(App));
}

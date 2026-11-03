// @vitest-environment node
import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')) as {
  sideEffects?: unknown;
};

describe('package metadata', () => {
  it('declares the package side-effect free so bundlers can drop unused exports', () => {
    expect(pkg.sideEffects).toBe(false);
  });
});

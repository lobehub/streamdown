import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

const src = fileURLToPath(new URL('./src', import.meta.url));

export default defineConfig({
  resolve: {
    alias: [
      {
        find: /^@lobehub\/streamdown(\/profiler)?$/,
        replacement: `${src}$1`,
      },
    ],
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.test.{ts,tsx}'],
  },
});

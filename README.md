# @lobehub/streamdown

Headless streaming markdown engine for React. Render markdown as it arrives from an LLM: per-character reveal, block-level caching, and a LaTeX guard that keeps half-typed math from breaking mid-stream.

Ships zero styles. No component dependencies.

[Docs & playground](https://streamdown.lobehub.com) · [npm](https://www.npmjs.com/package/@lobehub/streamdown)

## Features

- **Smooth reveal** — character or word granularity with three cadence presets (`realtime`, `balanced`, `silky`).
- **Block cache** — finished blocks memoize; only the open tail block re-renders on each commit.
- **LaTeX guard** — unbalanced delimiters stay inert until the stream closes them, so `$x^2$` never flashes as raw source.
- **Headless** — no stylesheet, no component dependencies. Bring your own CSS.

## Install

```bash
pnpm add @lobehub/streamdown
```

`react` and `react-dom` `^19` are peer dependencies. The package is ESM-only and ships a `'use client'` boundary, so it works in React Server Component frameworks without extra wiring.

## Usage

```tsx
import { Streamdown } from '@lobehub/streamdown';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

const Message = ({ content }: { content: string }) => (
  <Streamdown content={content} latexGuard rehypePlugins={[rehypeKatex]} remarkPlugins={[remarkGfm, remarkMath]} />
);
```

`content` may be a partial document — an unterminated code fence, a half-written table, or a formula missing its closing `$`. The engine re-lexes only the open tail block, so the cost of a commit grows with the tail, not with the message.

Style the output yourself. The rendered tree is plain markdown HTML plus fade animation classes (`STREAMDOWN_ANIMATED_CLASS`, `STREAM_FADE_DURATION`).

## Props

| Prop                                      | Type                                 | Default      | Description                                                  |
| ----------------------------------------- | ------------------------------------ | ------------ | ------------------------------------------------------------ |
| `content`                                 | `string`                             | —            | The (partial) markdown to render                             |
| `smoothing`                               | `'realtime' \| 'balanced' \| 'silky'` | `'balanced'` | Reveal pacing preset                                         |
| `granularity`                             | `'char' \| 'word'`                   | `'char'`     | Fade animation unit                                          |
| `latexGuard`                              | `boolean`                            | `false`      | Hold the last frame while a trailing formula is incomplete   |
| `preprocess`                              | `(text: string) => string`           | —            | Transform content before rendering                           |
| `components` / `remarkPlugins` / `rehypePlugins` | —                             | —            | Passed through to `react-markdown`                           |

## Lower-level API

Everything the component is built on is exported for custom pipelines:

- `useSmoothStreamContent` / `useStreamQueue` — pacing and block-queue primitives.
- `rehypeStreamAnimated` — the rehype plugin that tags freshly revealed nodes.
- `CachedMarkdown`, `findOpenFenceLanguage`, `STREAM_FADE_DURATION`.
- LaTeX preprocessing: `preprocessLaTeX`, `validateLatexExpressions`, `isLastFormulaRenderable`, and friends.
- `@lobehub/streamdown/profiler` — `StreamdownProfilerProvider` and hooks for measuring commit cost.

### Limitation: cross-block references

Each top-level block is parsed independently, so a reference whose target sits in another block stays literal: GFM footnotes, reference-style links (`[text][ref]`) and reference-style images. Inline forms are unaffected. Supply a remark/rehype plugin pair if you need to resolve these out of band.

## Development

```bash
pnpm install

pnpm dev          # site dev server
pnpm build        # library → es/
pnpm build:site   # site → site/dist
pnpm deploy:site  # build + wrangler pages deploy

pnpm test         # vitest
pnpm type-check   # tsc, library + site
pnpm lint
```

Releases are automated with semantic-release from gitmoji-style commit messages on `main`.

## License

[MIT](./LICENSE) © LobeHub

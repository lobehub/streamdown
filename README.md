<a name="readme-top"></a>

<div align="center">

<img height="120" src="https://registry.npmmirror.com/@lobehub/assets-logo/1.0.0/files/assets/logo-3d.webp">
<img height="120" src="https://gw.alipayobjects.com/zos/kitchen/qJ3l3EPsdW/split.svg">
<img height="120" src="https://registry.npmmirror.com/@lobehub/assets-emoji/1.3.0/files/assets/writing-hand.webp">

<h1>Streamdown</h1>

Headless streaming markdown engine for React — render markdown as it arrives

[Documents & Playground](https://streamdown.lobehub.com) · [Changelog](https://github.com/lobehub/streamdown/releases) · [Report Bug][github-issues-link] · [Request Feature][github-issues-link]

<!-- SHIELD GROUP -->

[![][npm-release-shield]][npm-release-link]
[![][website-shield]][website-link]
[![][discord-shield]][discord-link]
[![][npm-downloads-shield]][npm-downloads-link]<br/>
[![][github-releasedate-shield]][github-releasedate-link]
[![][github-action-test-shield]][github-action-test-link]
[![][github-action-release-shield]][github-action-release-link]<br/>
[![][github-contributors-shield]][github-contributors-link]
[![][github-forks-shield]][github-forks-link]
[![][github-stars-shield]][github-stars-link]
[![][github-issues-shield]][github-issues-link]
[![][github-license-shield]][github-license-link]

[![][banner]][website-link]

</div>

<details>
<summary><kbd>Table of contents</kbd></summary>

#### TOC

- [✨ Features](#-features)
- [📦 Installation](#-installation)
- [🚀 Usage](#-usage)
- [🧩 Props](#-props)
- [🧬 Lower-level API](#-lower-level-api)
  - [Limitation: cross-block references](#limitation-cross-block-references)
- [⌨️ Local Development](#️-local-development)
- [🤝 Contributing](#-contributing)
- [🩷 Sponsor](#-sponsor)
- [🔗 Links](#-links)
  - [Credits](#credits)
  - [More Products](#more-products)
  - [Design Resources](#design-resources)
  - [Development Resources](#development-resources)

####

</details>

## ✨ Features

- **Smooth reveal** — character or word granularity with three cadence presets (`realtime`, `balanced`, `silky`).
- **Block cache** — finished blocks memoize; only the open tail block re-renders on each commit.
- **LaTeX guard** — unbalanced delimiters stay inert until the stream closes them, so `$x^2$` never flashes as raw source.
- **Headless** — no stylesheet, no component dependencies. Bring your own CSS.

<div align="right">

[![][back-to-top]](#readme-top)

</div>

## 📦 Installation

> \[!IMPORTANT]\
> This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).

To install Streamdown, run the following command:

[![][pnpm-shield]][pnpm-link]

```bash
$ pnpm add @lobehub/streamdown
```

`react` and `react-dom` `^19` are peer dependencies. The package ships a `'use client'` boundary, so it renders from React Server Component frameworks without extra wiring.

<div align="right">

[![][back-to-top]](#readme-top)

</div>

## 🚀 Usage

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

<div align="right">

[![][back-to-top]](#readme-top)

</div>

## 🧩 Props

| Prop                                               | Type                                   | Default        | Description                                                  |
| -------------------------------------------------- | -------------------------------------- | -------------- | ------------------------------------------------------------ |
| `content`                                          | `string`                               | —              | The (partial) markdown to render                             |
| `smoothing`                                        | `'realtime' \| 'balanced' \| 'silky'`  | `'balanced'`   | Reveal pacing preset                                         |
| `granularity`                                      | `'char' \| 'word'`                     | `'char'`       | Fade animation unit                                          |
| `latexGuard`                                       | `boolean`                              | `false`        | Hold the last frame while a trailing formula is incomplete   |
| `preprocess`                                       | `(text: string) => string`             | —              | Transform content before rendering                           |
| `components` / `remarkPlugins` / `rehypePlugins`   | —                                      | —              | Passed through to `react-markdown`                           |

<div align="right">

[![][back-to-top]](#readme-top)

</div>

## 🧬 Lower-level API

Everything the component is built on is exported for custom pipelines:

- `useSmoothStreamContent` / `useStreamQueue` — pacing and block-queue primitives.
- `rehypeStreamAnimated` — the rehype plugin that tags freshly revealed nodes.
- `CachedMarkdown`, `findOpenFenceLanguage`, `STREAM_FADE_DURATION`.
- LaTeX preprocessing: `preprocessLaTeX`, `validateLatexExpressions`, `isLastFormulaRenderable`, and friends.
- `@lobehub/streamdown/profiler` — `StreamdownProfilerProvider` and hooks for measuring commit cost.

### Limitation: cross-block references

Each top-level block is parsed independently, so a reference whose target sits in another block stays literal: GFM footnotes, reference-style links (`[text][ref]`) and reference-style images. Inline forms are unaffected. Supply a remark/rehype plugin pair if you need to resolve these out of band.

<div align="right">

[![][back-to-top]](#readme-top)

</div>

## ⌨️ Local Development

You can use Github Codespaces for online development:

[![][codespaces-shield]][codespaces-link]

Or clone it for local development:

```bash
$ git clone https://github.com/lobehub/streamdown.git
$ cd streamdown
$ pnpm install
$ pnpm dev
```

The remaining scripts:

```bash
$ pnpm build        # library → es/
$ pnpm build:site   # site → site/dist
$ pnpm deploy:site  # build + wrangler pages deploy

$ pnpm test         # vitest
$ pnpm type-check   # tsc, library + site
$ pnpm lint
```

<div align="right">

[![][back-to-top]](#readme-top)

</div>

## 🤝 Contributing

Contributions of all types are more than welcome, if you are interested in contributing code, feel free to check out our GitHub [Issues][github-issues-link] to get stuck in to show us what you’re made of.

[![][pr-welcome-shield]][pr-welcome-link]

Releases are automated with semantic-release from gitmoji-style commit messages on `main`.

<div align="right">

[![][back-to-top]](#readme-top)

</div>

## 🩷 Sponsor

Every bit counts and your one-time donation sparkles in our galaxy of support! You're a shooting star, making a swift and bright impact on our journey. Thank you for believing in us – your generosity guides us toward our mission, one brilliant flash at a time.

<a href="https://opencollective.com/lobehub" target="_blank">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://github.com/lobehub/.github/blob/main/static/sponsor-dark.png?raw=true">
    <img  src="https://github.com/lobehub/.github/blob/main/static/sponsor-light.png?raw=true">
  </picture>
</a>

<div align="right">

[![][back-to-top]](#readme-top)

</div>

## 🔗 Links

### Credits

- **[react-markdown](https://github.com/remarkjs/react-markdown)** - Markdown to React renderer
- **[marked](https://github.com/markedjs/marked)** - Markdown lexer
- **[KaTeX](https://github.com/KaTeX/KaTeX)** - Fast math typesetting
- **[remend](https://github.com/vercel/streamdown)** - Partial markdown completion

### More Products

- **[🤯 Lobe Chat](https://github.com/lobehub/lobe-chat)** - An open-source, extensible (Function Calling), high-performance chatbot framework. It supports one-click free deployment of your private ChatGPT/LLM web application.
- **[🅰️ Lobe Theme](https://github.com/lobehub/sd-webui-lobe-theme)** - The modern theme for stable diffusion webui, exquisite interface design, highly customizable UI, and efficiency boosting features.
- **[🧸 Lobe Vidol](https://github.com/lobehub/lobe-vidol)** - Experience the magic of virtual idol creation with Lobe Vidol, enjoy the elegance of our Exquisite UI Design, dance along using MMD Dance Support, and engage in Smooth Conversations.

### Design Resources

- **[🍭 Lobe UI](https://ui.lobehub.com)** - An open-source UI component library for building AIGC web apps.
- **[🥨 Lobe Icons](https://lobehub.com/icons)** - Popular AI / LLM Model Brand SVG Logo and Icon Collection.
- **[📊 Lobe Charts](https://charts.lobehub.com)** - React modern charts components built on recharts
- **[✍️ Streamdown](https://streamdown.lobehub.com)** - Headless streaming markdown engine for React

### Development Resources

- **[🎤 Lobe TTS](https://tts.lobehub.com)** - A high-quality & reliable TTS/STT library for Server and Browser
- **[🌏 Lobe i18n](https://github.com/lobehub/lobe-cli-toolbox/blob/master/packages/lobe-i18n)** - Automation ai tool for the i18n (internationalization) translation process.

[More Resources](https://lobehub.com/resources)

<div align="right">

[![][back-to-top]](#readme-top)

</div>

---

<details><summary><h4>📝 License</h4></summary>

[![][github-license-shield]][github-license-link]

</details>

Copyright © 2023 [LobeHub][profile-link]. <br />
This project is [MIT](./LICENSE) licensed.

<!-- LINK GROUP -->

[back-to-top]: https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square
[banner]: https://streamdown.lobehub.com/og.png
[pnpm-link]: https://pnpm.io
[pnpm-shield]: https://img.shields.io/badge/-pnpm-F69220?logo=pnpm&style=for-the-badge
[codespaces-link]: https://codespaces.new/lobehub/streamdown
[codespaces-shield]: https://github.com/codespaces/badge.svg
[discord-link]: https://discord.gg/AYFPHvv2jT
[discord-shield]: https://img.shields.io/discord/1127171173982154893?color=5865F2&label=discord&labelColor=black&logo=discord&logoColor=white&style=flat-square
[github-action-release-link]: https://github.com/lobehub/streamdown/actions/workflows/release.yml
[github-action-release-shield]: https://img.shields.io/github/actions/workflow/status/lobehub/streamdown/release.yml?label=release&labelColor=black&logo=githubactions&logoColor=white&style=flat-square
[github-action-test-link]: https://github.com/lobehub/streamdown/actions/workflows/test.yml
[github-action-test-shield]: https://img.shields.io/github/actions/workflow/status/lobehub/streamdown/test.yml?label=test&labelColor=black&logo=githubactions&logoColor=white&style=flat-square
[github-contributors-link]: https://github.com/lobehub/streamdown/graphs/contributors
[github-contributors-shield]: https://img.shields.io/github/contributors/lobehub/streamdown?color=c4f042&labelColor=black&style=flat-square
[github-forks-link]: https://github.com/lobehub/streamdown/network/members
[github-forks-shield]: https://img.shields.io/github/forks/lobehub/streamdown?color=8ae8ff&labelColor=black&style=flat-square
[github-issues-link]: https://github.com/lobehub/streamdown/issues
[github-issues-shield]: https://img.shields.io/github/issues/lobehub/streamdown?color=ff80eb&labelColor=black&style=flat-square
[github-license-link]: https://github.com/lobehub/streamdown/blob/main/LICENSE
[github-license-shield]: https://img.shields.io/github/license/lobehub/streamdown?color=white&labelColor=black&style=flat-square
[github-releasedate-link]: https://github.com/lobehub/streamdown/releases
[github-releasedate-shield]: https://img.shields.io/github/release-date/lobehub/streamdown?labelColor=black&style=flat-square
[github-stars-link]: https://github.com/lobehub/streamdown/network/stargazers
[github-stars-shield]: https://img.shields.io/github/stars/lobehub/streamdown?color=ffcb47&labelColor=black&style=flat-square
[npm-downloads-link]: https://www.npmjs.com/package/@lobehub/streamdown
[npm-downloads-shield]: https://img.shields.io/npm/dt/@lobehub/streamdown?labelColor=black&style=flat-square
[npm-release-link]: https://www.npmjs.com/package/@lobehub/streamdown
[npm-release-shield]: https://img.shields.io/npm/v/@lobehub/streamdown?color=369eff&labelColor=black&logo=npm&logoColor=white&style=flat-square
[pr-welcome-link]: https://github.com/lobehub/streamdown/pulls
[pr-welcome-shield]: https://img.shields.io/badge/🤯_pr_welcome-%E2%86%92-ffcb47?labelColor=black&style=for-the-badge
[profile-link]: https://github.com/lobehub
[website-link]: https://streamdown.lobehub.com
[website-shield]: https://img.shields.io/website?down_message=offline&label=docs&labelColor=black&logo=cloudflare&style=flat-square&up_message=online&url=https%3A%2F%2Fstreamdown.lobehub.com

<a name="readme-top"></a>

<div align="center">

![](https://github.com/user-attachments/assets/ef37c74e-8223-4838-8eb1-b15181f53aea)

<h1>🌊 Streamdown</h1>

<h3>The Streaming Markdown Engine for React</h3>

LobeHub's headless React renderer for markdown that streams in from LLMs. It caches finished blocks, reveals text smoothly character by character, and keeps half-typed LaTeX from flashing.

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

</div>

<details>
<summary><kbd>Table of contents</kbd></summary>

#### TOC

- [✨ Why Streamdown?](#-why-streamdown)
- [🚀 Getting Started](#-getting-started)
- [⚙️ Common Options](#️-common-options)
- [🤖 AI-Powered Development](#-ai-powered-development)
- [📖 Documentation](#-documentation)
- [⌨️ Local Development](#️-local-development)
- [🤝 Contributing](#-contributing)
- [🩷 Sponsor](#-sponsor)
- [🔗 Links](#-links)

####

</details>

## ✨ Why Streamdown?

Streamdown renders the markdown an LLM has sent so far, and keeps rendering it as the rest arrives.

- **Partial markdown just works**: an open code fence, a half-written table, an unclosed `**bold` or a formula missing its closing `$` render as formatted content, not raw syntax.
- **Cheap commits**: finished blocks are cached, so each update only re-renders the open tail block.
- **Smooth reveal**: bursty chunks turn into a steady per-character or per-word fade, with three pacing presets.
- **LaTeX guard**: an incomplete trailing formula keeps the last good frame instead of flashing source or a KaTeX error.
- **Headless**: no stylesheet and no component dependencies. Bring your own typography, highlighter and plugins.
- **AI-native docs**: coding agents read the docs through [skills.md](https://streamdown.lobehub.com/skills.md) and [llms.txt](https://streamdown.lobehub.com/llms.txt).

<div align="right">

[![][back-to-top]](#readme-top)

</div>

## 🚀 Getting Started

[![][pnpm-shield]][pnpm-link]

```bash
$ pnpm add @lobehub/streamdown
```

Streamdown is ESM only and needs `react` and `react-dom` `^19` as peer dependencies. It ships a `'use client'` boundary, so it also renders from React Server Component frameworks.

Pass the markdown received so far as `content` and re-render as chunks arrive:

```tsx
import { Streamdown } from "@lobehub/streamdown";

export const Message = ({ content }: { content: string }) => (
  <Streamdown content={content} />
);
```

<div align="right">

[![][back-to-top]](#readme-top)

</div>

## ⚙️ Common Options

```tsx
import { preprocessLaTeX, Streamdown } from "@lobehub/streamdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";

export const Message = ({ content }: { content: string }) => (
  <Streamdown
    content={content}
    granularity="word"
    latexGuard
    preprocess={preprocessLaTeX}
    rehypePlugins={[rehypeKatex]}
    remarkPlugins={[remarkGfm, remarkMath]}
    smoothing="silky"
  />
);
```

| Prop                                             | Default      | Use it to                                                                        |
| ------------------------------------------------ | ------------ | -------------------------------------------------------------------------------- |
| `smoothing`                                      | `'balanced'` | Pick the reveal pace: `'realtime'`, `'balanced'` or `'silky'`                    |
| `granularity`                                    | `'char'`     | Fade per character or per `'word'`                                               |
| `latexGuard`                                     | `false`      | Hold the last frame while a trailing formula is incomplete (enable with math)    |
| `preprocess`                                     | —            | Transform content before rendering, e.g. `preprocessLaTeX` for model-style LaTeX |
| `remend`                                         | —            | Options for completing the open tail block, e.g. `{ htmlTags: false }`           |
| `components` / `remarkPlugins` / `rehypePlugins` | —            | Passed through to `react-markdown`, e.g. a code highlighter for `pre`            |

To measure commit cost in your app, wrap Streamdown in `StreamdownProfilerProvider` from `@lobehub/streamdown/profiler`. The full API, the lower-level hooks and live demos are on the [documentation site][website-link].

<div align="right">

[![][back-to-top]](#readme-top)

</div>

## 🤖 AI-Powered Development

The docs are generated for coding agents as well as people.

| Resource                                              | What it does                                                             |
| ----------------------------------------------------- | ------------------------------------------------------------------------ |
| [skills.md](https://streamdown.lobehub.com/skills.md) | Agent skill entry point with a Markdown reference for every page         |
| [llms.txt](https://streamdown.lobehub.com/llms.txt)   | Page index with outlines for [llms.txt](https://llmstxt.org)-aware tools |

Paste this into Cursor, Claude Code, Codex or any other coding agent:

```text
Read https://streamdown.lobehub.com/skills.md, then use @lobehub/streamdown to render my chat's streaming assistant messages with GFM and math. Only use props and imports documented there.
```

<div align="right">

[![][back-to-top]](#readme-top)

</div>

## 📖 Documentation

- **Docs and playground**: [streamdown.lobehub.com][website-link]
- **Introduction**: [streamdown.lobehub.com/guide/introduction](https://streamdown.lobehub.com/guide/introduction)
- **Getting started**: [streamdown.lobehub.com/guide/getting-started](https://streamdown.lobehub.com/guide/getting-started)
- **API**: [streamdown.lobehub.com/components/streamdown](https://streamdown.lobehub.com/components/streamdown)
- **Changelog**: [CHANGELOG.md](./CHANGELOG.md)

<div align="right">

[![][back-to-top]](#readme-top)

</div>

## ⌨️ Local Development

You can use Github Codespaces for online development:

[![][codespaces-shield]][codespaces-link]

Or clone it for local development (Node.js >= 22.22 and pnpm):

```bash
$ git clone https://github.com/lobehub/streamdown.git
$ cd streamdown
$ pnpm install
$ pnpm dev          # docs site with live demos (lobedocs dev)
```

Contributor and agent guidance lives in [AGENTS.md](./AGENTS.md).

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

- **[🍭 Lobe UI](https://github.com/lobehub/lobe-ui)** - React component library for AI apps
- **[🥨 Lobe Icons](https://github.com/lobehub/lobe-icons)** - AI / LLM brand logos and icons
- **[📊 Lobe Charts](https://github.com/lobehub/lobe-charts)** - React chart components
- **[✒️ Lobe Editor](https://github.com/lobehub/lobe-editor)** - Lexical-based rich text editor for React, with Markdown, plugins and a chat composer
- **[🎤 Lobe TTS](https://github.com/lobehub/lobe-tts)** - TTS / STT speech library
- **[📐 Lobe Lint](https://github.com/lobehub/lobe-lint)** - ESLint, Prettier, Stylelint, Commitlint and more lint configs
- **[😀 Fluent Emoji](https://github.com/lobehub/fluent-emoji)** - Fluent Emoji assets
- **[📖 Docs Kit](https://github.com/lobehub/docs-kit)** - Reusable documentation toolkit and lobedocs CLI for LobeHub component libraries
- **[🌊 Streamdown](https://github.com/lobehub/streamdown)** - Headless streaming markdown engine for React

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

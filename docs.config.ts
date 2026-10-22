// @lobehub/docs-kit has no stable export for `defineDocsConfig` (it is an identity function),
// so this exports a plain object. Restart `lobedocs dev` after editing.
export default {
  alias: {
    "@lobehub/streamdown": "src",
  },
  atomDirs: [{ dir: "src" }],
  description:
    "Headless streaming markdown engine for React with block caching, smooth per-character reveal and a LaTeX guard.",
  favicons: {
    appleTouchIcon: "/apple-touch-icon.png",
    icon: "/favicon.svg",
    icon16: "/favicon.svg",
    icon32: "/favicon.svg",
  },
  homePage: "./docs/home/home.tsx",
  publicDocs: [
    "docs/guide/getting-started.mdx",
    "docs/guide/streaming.mdx",
    "docs/guide/smooth-reveal.mdx",
    "docs/guide/animation.mdx",
    "docs/guide/code-fences.mdx",
    "docs/guide/latex.mdx",
    "docs/guide/remend.mdx",
  ],
  siteUrl: "https://streamdown.lobehub.com",
  themeConfig: {
    apiHeader: {
      docUrl: "{github}/edit/main/{atomId}",
      github: "https://github.com/lobehub/streamdown",
      packageName: "@lobehub/streamdown",
      sourceUrl: "{github}/tree/main/{atomId}",
    },
    metadata: {
      openGraph: {
        image: "https://streamdown.lobehub.com/og.png",
      },
    },
    navItems: [
      {
        href: "/guide/getting-started",
        icon: "rocket",
        label: "Getting Started",
      },
      { href: "/guide/streaming", icon: "blocks", label: "Streaming & Blocks" },
      {
        href: "/guide/smooth-reveal",
        icon: "activity",
        label: "Smooth Reveal",
      },
      { href: "/guide/animation", icon: "sparkles", label: "Animation" },
      { href: "/guide/code-fences", icon: "code", label: "Code Fences" },
      { href: "/guide/latex", icon: "sigma", label: "LaTeX" },
      { href: "/guide/remend", icon: "wand-sparkles", label: "remend" },
    ],
    prefersColor: "auto",
    socialLinks: [
      {
        href: "https://github.com/lobehub/streamdown",
        icon: "github",
        label: "GitHub",
      },
      {
        href: "https://discord.gg/AYFPHvv2jT",
        icon: "discord",
        label: "Discord",
      },
      {
        href: "https://www.npmjs.com/package/@lobehub/streamdown",
        icon: "npm",
        label: "NPM",
      },
    ],
  },
  title: "Streamdown",
};

// @lobehub/docs-kit has no stable export for `defineDocsConfig` (it is an identity function),
// so this exports a plain object. Restart `lobedocs dev` after editing.
export default {
  alias: {
    "@lobehub/streamdown": "src",
  },
  atomDirs: [{ dir: "src" }],
  description:
    "A headless React renderer for LLM markdown: caches finished blocks, reveals text smoothly, completes half-typed syntax.",
  favicons: {
    appleTouchIcon: "/apple-touch-icon.png",
    icon: "/favicon.svg",
    icon16: "/favicon.svg",
    icon32: "/favicon.svg",
  },
  homePage: "./docs/home/home.tsx",
  publicDocs: [
    "docs/guide/introduction.mdx",
    "docs/guide/getting-started.mdx",
    "docs/guide/usage.mdx",
    "docs/features/incomplete-markdown.mdx",
    "docs/features/blocks.mdx",
    "docs/features/smooth-reveal.mdx",
    "docs/features/animation.mdx",
    "docs/content/code-fences.mdx",
    "docs/content/latex.mdx",
    "docs/content/components.mdx",
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
        image:
          "https://repository-images.githubusercontent.com/1362345259/9438e06e-10ab-4265-b8f5-b396f923b2bb",
      },
    },
    prefersColor: "auto",
    // Sidebar order tells the story: why → how to start → streaming features → rich content,
    // then the API pages.
    sidebarGroups: [
      { dir: "docs/guide", icon: "rocket", order: -3, title: "Get Started" },
      { dir: "docs/features", icon: "activity", order: -2, title: "Streaming" },
      { dir: "docs/content", icon: "shapes", order: -1, title: "Rich Content" },
      // Without a group, src/ pages land in the built-in "Components" section, which docs-kit
      // always pins to the top of the sidebar.
      { dir: "src", icon: "code", order: 0, title: "API Reference" },
    ],
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

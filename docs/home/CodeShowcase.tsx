import { CodeShowcase, type CodeShowcaseItem } from "@lobehub/ui/awesome";

import { HeroStreamDemo } from "./demos";

const EXAMPLES: CodeShowcaseItem[] = [
  {
    code: `import { Streamdown } from '@lobehub/streamdown';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

export const Message = ({ content }: { content: string }) => (
  <Streamdown
    // your highlighter for code blocks, e.g. { pre: Pre }
    components={components}
    content={content}
    latexGuard
    rehypePlugins={[rehypeKatex]}
    remarkPlugins={[remarkGfm, remarkMath]}
  />
);`,
    key: "message",
    label: "Message.tsx",
    preview: <HeroStreamDemo />,
  },
];

export function CodeShowcaseSection() {
  return <CodeShowcase items={EXAMPLES} />;
}

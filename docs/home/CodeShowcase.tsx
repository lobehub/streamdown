import { CodeShowcase, type CodeShowcaseItem } from "@lobehub/ui/awesome";

import { BasicPreview, MathPreview, SmoothingPreview } from "./demos";

const EXAMPLES: CodeShowcaseItem[] = [
  {
    code: `import { Streamdown } from '@lobehub/streamdown';

export const Message = ({ content }: { content: string }) => (
  <Streamdown content={content} />
);`,
    key: "basic",
    label: "Streamdown",
    preview: <BasicPreview />,
  },
  {
    code: `import { Streamdown } from '@lobehub/streamdown';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';

<Streamdown
  content={content}
  latexGuard
  rehypePlugins={[rehypeKatex]}
  remarkPlugins={[remarkMath]}
/>`,
    key: "math",
    label: "latexGuard",
    preview: <MathPreview />,
  },
  {
    code: `import { Streamdown } from '@lobehub/streamdown';

<Streamdown
  content={content}
  granularity="char"
  smoothing="silky"
/>`,
    key: "smoothing",
    label: "smoothing",
    preview: <SmoothingPreview />,
  },
];

export function CodeShowcaseSection() {
  return <CodeShowcase items={EXAMPLES} />;
}

import { Streamdown } from "@lobehub/streamdown";
import { Block, Typography } from "@lobehub/ui";
import { useMemo } from "react";
import remarkGfm from "remark-gfm";

import { markdownComponents } from "../../src/Streamdown/demos/shared/markdownComponents";

// The original site's API card (f3ba7b3:site/src/lib/samples.ts `apiReference`), updated to the
// current StreamdownProps in src/Streamdown.tsx (adds `remend`).
const API_REFERENCE = `| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`content\` | \`string\` | — | The (partial) markdown to render |
| \`smoothing\` | \`'realtime' \\| 'balanced' \\| 'silky'\` | \`'balanced'\` | Reveal pacing preset |
| \`granularity\` | \`'char' \\| 'word'\` | \`'char'\` | Fade animation unit |
| \`latexGuard\` | \`boolean\` | \`false\` | Hold last frame while trailing formula is incomplete |
| \`preprocess\` | \`(text: string) => string\` | — | Transform content before rendering |
| \`remend\` | \`RemendOptions\` | — | Options for the remend pass on the open tail block |
| \`components\` / \`remarkPlugins\` / \`rehypePlugins\` | — | — | Passed through to react-markdown |

Lower-level hooks — \`useSmoothStreamContent\`, \`useStreamQueue\`,
\`rehypeStreamAnimated\` and the LaTeX preprocessing helpers — are exported for
custom pipelines. Profiling lives in \`@lobehub/streamdown/profiler\`.

### Limitation: cross-block references

Each top-level block is parsed independently, so a reference whose target sits in
another block stays literal: GFM footnotes, reference-style links
(\`[text][ref]\`) and reference-style images. Inline forms are unaffected. Supply
a remark/rehype plugin pair if you need to resolve these out of band.
`;

export const ApiSection = () => {
  const remarkPlugins = useMemo(() => [remarkGfm], []);

  return (
    <Block padding={24} variant={"outlined"} width={"100%"}>
      <Typography fontSize={14}>
        <Streamdown
          components={markdownComponents}
          content={API_REFERENCE}
          remarkPlugins={remarkPlugins}
        />
      </Typography>
    </Block>
  );
};

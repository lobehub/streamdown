import { findOpenFenceLanguage } from "@lobehub/streamdown";
import { Tag } from "@lobehub/ui";
import { useMemo } from "react";
import remarkGfm from "remark-gfm";

import { StreamPane } from "./shared/StreamPane";
import { useLocalStream } from "./shared/useLocalStream";

const SOURCE = `A fence stays a code block while it is still open, so the language tag and the
first lines render as code before the closing backticks arrive.

\`\`\`ts
export const reveal = (chars: string[], delay = 18) =>
  chars.map((char, index) => ({ char, delay: index * delay }));

export const total = (chars: string[], delay = 18) => chars.length * delay;
\`\`\`

Diagrams work the same way: render \`mermaid\` fences with your own component.

\`\`\`mermaid
graph LR
  A[LLM chunks] --> B[Smoother]
  B --> C[Block lexer]
  C --> D[Cached blocks]
  C --> E[Open tail]
\`\`\`
`;

export default () => {
  const { restart, text } = useLocalStream(SOURCE, {
    chunkSize: 4,
    jitter: 0.3,
    tps: 160,
  });
  const openFence = findOpenFenceLanguage(text);
  const remarkPlugins = useMemo(() => [remarkGfm], []);

  return (
    <StreamPane
      content={text}
      height={380}
      remarkPlugins={remarkPlugins}
      title={"findOpenFenceLanguage(content)"}
      extra={
        <Tag color={openFence === null ? undefined : "blue"}>
          {openFence === null
            ? "no open fence"
            : `open fence: ${openFence || "(none)"}`}
        </Tag>
      }
      onReplay={restart}
    />
  );
};

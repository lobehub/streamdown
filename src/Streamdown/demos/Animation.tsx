import { type StreamAnimationGranularity } from "@lobehub/streamdown";
import { Segmented } from "@lobehub/ui";
import { useState } from "react";

import { StreamPane } from "./shared/StreamPane";
import { useLocalStream } from "./shared/useLocalStream";

const SOURCE = `Every newly revealed character is wrapped and faded in with a CSS animation, staggered by
\`animation-delay\` instead of a re-render per frame.

With \`granularity="word"\` whole words fade together, which reads calmer for languages that put
spaces between words. Code fences skip the per-character fade and reveal as a block.

\`\`\`ts
const fade = 'streamdown-fade-in';
\`\`\`

Under \`prefers-reduced-motion: reduce\` block fades are turned off.
`;

export default () => {
  const [granularity, setGranularity] =
    useState<StreamAnimationGranularity>("char");
  const { restart, text } = useLocalStream(SOURCE, {
    chunkSize: 6,
    jitter: 0.4,
    tps: 140,
  });

  return (
    <StreamPane
      content={text}
      granularity={granularity}
      height={260}
      title={"granularity"}
      extra={
        <Segmented
          size={"small"}
          value={granularity}
          options={[
            { label: "char", value: "char" },
            { label: "word", value: "word" },
          ]}
          onChange={(value) => {
            setGranularity(value);
            restart();
          }}
        />
      }
      onReplay={restart}
    />
  );
};

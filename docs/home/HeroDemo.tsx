import "katex/dist/katex.min.css";

import { Text } from "@lobehub/ui";
import { useMemo } from "react";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import { heroSample } from "../../src/Streamdown/demos/shared/samples";
import { StreamPane } from "../../src/Streamdown/demos/shared/StreamPane";
import { useLocalStream } from "../../src/Streamdown/demos/shared/useLocalStream";

/** The original hero demo: heroSample streamed once, 6 characters every ~24ms. */
export const HeroDemo = () => {
  const { restart, text } = useLocalStream(heroSample, {
    chunkSize: 6,
    delayMs: 24,
  });
  const remarkPlugins = useMemo(() => [remarkGfm, remarkMath], []);
  const rehypePlugins = useMemo(() => [rehypeKatex], []);

  return (
    <StreamPane
      latexGuard
      content={text}
      height={600}
      rehypePlugins={rehypePlugins}
      remarkPlugins={remarkPlugins}
      title={"heroSample.md"}
      extra={
        <Text fontSize={12} type={"secondary"}>
          ● streaming
        </Text>
      }
      onReplay={restart}
    />
  );
};

import "katex/dist/katex.min.css";

import { Streamdown, type StreamdownProps } from "@lobehub/streamdown";
import { Typography } from "@lobehub/ui";
import { type CSSProperties, useMemo } from "react";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import { markdownComponents } from "../../src/Streamdown/demos/shared/markdownComponents";
import { heroSample } from "../../src/Streamdown/demos/shared/samples";
import { useLocalStream } from "../../src/Streamdown/demos/shared/useLocalStream";
import { useStickToBottom } from "../../src/Streamdown/demos/shared/useStickToBottom";

const scrollStyle = (height: number | string): CSSProperties => ({
  height,
  overflowY: "auto",
  width: "100%",
});

interface LoopingStreamProps extends Omit<StreamdownProps, "content"> {
  chunkSize?: number;
  height?: number | string;
  source: string;
  tps?: number;
}

/** A Streamdown that replays `source` forever, for live landing tiles. */
export const LoopingStream = ({
  chunkSize = 4,
  height = "100%",
  source,
  tps = 120,
  ...rest
}: LoopingStreamProps) => {
  const { text } = useLocalStream(source, {
    chunkSize,
    jitter: 0.4,
    loop: true,
    tps,
  });
  const { onScroll, ref } = useStickToBottom();

  return (
    <div ref={ref} style={scrollStyle(height)} onScroll={onScroll}>
      <Typography fontSize={14}>
        <Streamdown components={markdownComponents} content={text} {...rest} />
      </Typography>
    </div>
  );
};

/** The one live demo on the home page: GFM, code and math streaming in a loop. */
export const HeroStreamDemo = () => {
  const remarkPlugins = useMemo(() => [remarkGfm, remarkMath], []);
  const rehypePlugins = useMemo(() => [rehypeKatex], []);

  return (
    <LoopingStream
      latexGuard
      chunkSize={6}
      height={340}
      rehypePlugins={rehypePlugins}
      remarkPlugins={remarkPlugins}
      source={heroSample}
      tps={250}
    />
  );
};

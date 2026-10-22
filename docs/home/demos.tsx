import "katex/dist/katex.min.css";

import {
  preprocessLaTeX,
  Streamdown,
  type StreamdownProps,
} from "@lobehub/streamdown";
import {
  createStreamdownProfiler,
  StreamdownProfilerProvider,
} from "@lobehub/streamdown/profiler";
import { Flexbox, Highlighter, Typography } from "@lobehub/ui";
import { type CSSProperties, useMemo } from "react";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import { markdownComponents } from "../../src/Streamdown/demos/shared/markdownComponents";
import { ProfilerRate } from "../../src/Streamdown/demos/shared/ProfilerPanel";
import { heroSample } from "../../src/Streamdown/demos/shared/samples";
import { useLocalStream } from "../../src/Streamdown/demos/shared/useLocalStream";
import { useStickToBottom } from "../../src/Streamdown/demos/shared/useStickToBottom";

const MATH_SAMPLE = `The quadratic formula:

$$
x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}
$$

and Euler's identity inline: $e^{i\\pi} + 1 = 0$.
`;

const CODE_SAMPLE = `\`\`\`ts
const blocks = lex(content);
const tail = blocks.at(-1);
render(frozen, tail);
\`\`\`
`;

const WORD_SAMPLE = `Words fade in together with \`granularity="word"\`, staggered by CSS instead of re-renders.`;

const REMEND_SAMPLE = `Half-typed **bold, \`code\` and [links](https://lobehub.com) render formatted.`;

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

export const LatexDemo = () => {
  const remarkPlugins = useMemo(() => [remarkMath], []);
  const rehypePlugins = useMemo(() => [rehypeKatex], []);

  return (
    <LoopingStream
      latexGuard
      chunkSize={2}
      height={150}
      preprocess={preprocessLaTeX}
      rehypePlugins={rehypePlugins}
      remarkPlugins={remarkPlugins}
      source={MATH_SAMPLE}
      tps={60}
    />
  );
};

export const CodeFenceDemo = () => (
  <LoopingStream height={150} source={CODE_SAMPLE} tps={80} />
);

export const WordFadeDemo = () => (
  <LoopingStream
    granularity={"word"}
    height={110}
    source={WORD_SAMPLE}
    tps={40}
  />
);

export const RemendDemo = () => {
  const { text } = useLocalStream(REMEND_SAMPLE, {
    chunkSize: 1,
    jitter: 0,
    loop: true,
    tps: 24,
  });

  return (
    <Flexbox gap={6} width={"100%"}>
      <Highlighter
        language={"markdown"}
        showLanguage={false}
        variant={"borderless"}
      >
        {text || " "}
      </Highlighter>
      <Typography fontSize={14}>
        <Streamdown content={text} />
      </Typography>
    </Flexbox>
  );
};

export const ProfilerDemo = () => {
  const profiler = useMemo(
    () => createStreamdownProfiler({ label: "home" }),
    [],
  );

  return (
    <Flexbox gap={8} width={"100%"}>
      <ProfilerRate profiler={profiler} />
      <StreamdownProfilerProvider profiler={profiler}>
        <LoopingStream
          chunkSize={12}
          height={110}
          source={heroSample}
          tps={600}
        />
      </StreamdownProfilerProvider>
    </Flexbox>
  );
};

const BASIC_SAMPLE = `**Streamdown** renders this paragraph *while it streams*, with \`inline code\` and a [link](https://lobehub.com).`;

export const BasicPreview = () => (
  <LoopingStream height={240} source={BASIC_SAMPLE} tps={60} />
);

export const MathPreview = () => {
  const remarkPlugins = useMemo(() => [remarkGfm, remarkMath], []);
  const rehypePlugins = useMemo(() => [rehypeKatex], []);

  return (
    <LoopingStream
      latexGuard
      chunkSize={3}
      height={240}
      rehypePlugins={rehypePlugins}
      remarkPlugins={remarkPlugins}
      source={MATH_SAMPLE}
      tps={80}
    />
  );
};

export const SmoothingPreview = () => (
  <LoopingStream
    chunkSize={40}
    height={240}
    smoothing={"silky"}
    source={`Bursty chunks of forty characters arrive with heavy jitter, yet the **silky** preset reveals them at a calm, steady pace, one character at a time.`}
    tps={200}
  />
);

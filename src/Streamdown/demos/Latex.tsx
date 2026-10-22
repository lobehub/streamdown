import "katex/dist/katex.min.css";

import { preprocessLaTeX } from "@lobehub/streamdown";
import { Checkbox, Flexbox } from "@lobehub/ui";
import { useMemo, useState } from "react";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import { latexSample } from "./shared/samples";
import { StreamPane } from "./shared/StreamPane";
import { useLocalStream } from "./shared/useLocalStream";

export default () => {
  const [latexGuard, setLatexGuard] = useState(true);
  const [preprocess, setPreprocess] = useState(true);
  const { restart, text } = useLocalStream(latexSample, {
    chunkSize: 3,
    jitter: 0.3,
    tps: 120,
  });
  const remarkPlugins = useMemo(() => [remarkGfm, remarkMath], []);
  const rehypePlugins = useMemo(() => [rehypeKatex], []);

  return (
    <StreamPane
      content={text}
      height={400}
      latexGuard={latexGuard}
      preprocess={preprocess ? preprocessLaTeX : undefined}
      rehypePlugins={rehypePlugins}
      remarkPlugins={remarkPlugins}
      title={"remark-math + rehype-katex"}
      extra={
        <Flexbox horizontal gap={12}>
          <Checkbox checked={latexGuard} onChange={setLatexGuard}>
            latexGuard
          </Checkbox>
          <Checkbox checked={preprocess} onChange={setPreprocess}>
            preprocessLaTeX
          </Checkbox>
        </Flexbox>
      }
      onReplay={restart}
    />
  );
};

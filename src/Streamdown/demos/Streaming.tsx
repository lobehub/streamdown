import {
  createStreamdownProfiler,
  StreamdownProfilerProvider,
} from "@lobehub/streamdown/profiler";
import { Flexbox, Segmented } from "@lobehub/ui";
import { useMemo, useState } from "react";
import remarkGfm from "remark-gfm";

import { ProfilerPanel } from "./shared/ProfilerPanel";
import { markdownSample } from "./shared/samples";
import { StreamPane } from "./shared/StreamPane";
import { useLocalStream } from "./shared/useLocalStream";

const CHUNK_OPTIONS = [
  { label: "1 char", value: "1" },
  { label: "8 chars", value: "8" },
  { label: "64 chars", value: "64" },
];

export default () => {
  const [chunk, setChunk] = useState("8");
  const profiler = useMemo(
    () => createStreamdownProfiler({ label: "streaming" }),
    [],
  );
  const { restart, text } = useLocalStream(markdownSample, {
    chunkSize: Number(chunk),
    jitter: 0.3,
    tps: 400,
  });
  const remarkPlugins = useMemo(() => [remarkGfm], []);

  const replay = () => {
    profiler.reset("streaming");
    restart();
  };

  return (
    <Flexbox gap={12} width={"100%"}>
      <StreamdownProfilerProvider profiler={profiler}>
        <StreamPane
          content={text}
          remarkPlugins={remarkPlugins}
          title={"Upstream chunk size"}
          extra={
            <Segmented
              options={CHUNK_OPTIONS}
              size={"small"}
              value={chunk}
              onChange={(value) => {
                setChunk(value);
                replay();
              }}
            />
          }
          onReplay={replay}
        />
      </StreamdownProfilerProvider>
      <ProfilerPanel profiler={profiler} />
    </Flexbox>
  );
};

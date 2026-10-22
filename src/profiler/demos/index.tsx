import {
  createStreamdownProfiler,
  StreamdownProfilerProvider,
} from "@lobehub/streamdown/profiler";
import { Flexbox } from "@lobehub/ui";
import { useMemo } from "react";
import remarkGfm from "remark-gfm";

import { paragraphBatchCases } from "../../Streamdown/demos/shared/paragraphBatches";
import {
  ProfilerPanel,
  ProfilerRate,
} from "../../Streamdown/demos/shared/ProfilerPanel";
import { StreamPane } from "../../Streamdown/demos/shared/StreamPane";
import { useLocalStream } from "../../Streamdown/demos/shared/useLocalStream";

const { chunkSize, content, label } = paragraphBatchCases.highTps;

export default () => {
  const profiler = useMemo(
    () => createStreamdownProfiler({ label: "high-tps" }),
    [],
  );
  const { restart, text } = useLocalStream(content, {
    chunkSize,
    jitter: 0,
    tps: 2000,
  });
  const remarkPlugins = useMemo(() => [remarkGfm], []);

  return (
    <Flexbox gap={12} width={"100%"}>
      <StreamdownProfilerProvider profiler={profiler}>
        <StreamPane
          content={text}
          extra={<ProfilerRate profiler={profiler} />}
          height={360}
          remarkPlugins={remarkPlugins}
          title={label}
          onReplay={() => {
            profiler.reset("high-tps");
            restart();
          }}
        />
      </StreamdownProfilerProvider>
      <ProfilerPanel profiler={profiler} />
    </Flexbox>
  );
};

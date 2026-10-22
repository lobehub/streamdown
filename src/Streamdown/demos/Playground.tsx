import "katex/dist/katex.min.css";

import {
  preprocessLaTeX,
  type StreamAnimationGranularity,
  type StreamSmoothingPreset,
} from "@lobehub/streamdown";
import {
  createStreamdownProfiler,
  StreamdownProfilerProvider,
} from "@lobehub/streamdown/profiler";
import { Flexbox } from "@lobehub/ui";
import { StoryBook, useControls, useCreateStore } from "@lobehub/ui/storybook";
import { useEffect, useMemo } from "react";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import { paragraphBatchCases } from "./shared/paragraphBatches";
import { ProfilerPanel, ProfilerRate } from "./shared/ProfilerPanel";
import { type SampleKey, samples } from "./shared/samples";
import { StreamPane } from "./shared/StreamPane";
import { useLocalStream } from "./shared/useLocalStream";

const SAMPLE_OPTIONS = Object.fromEntries(
  Object.entries(samples).map(([value, { label }]) => [label, value]),
) as Record<string, SampleKey>;

const SMOOTHING_OPTIONS: StreamSmoothingPreset[] = [
  "realtime",
  "balanced",
  "silky",
];
const GRANULARITY_OPTIONS: StreamAnimationGranularity[] = ["char", "word"];

export default () => {
  const store = useCreateStore();
  const [controls, set] = useControls(
    () => ({
      sample: { options: SAMPLE_OPTIONS, value: "markdown" as SampleKey },
      tpsMode: {
        label: "TPS mode",
        options: ["fixed", "range"],
        value: "fixed",
      },
      tps: {
        label: "TPS (chars/s)",
        max: 5000,
        min: 10,
        render: (get) => get("tpsMode") === "fixed",
        step: 10,
        value: 250,
      },
      tpsRange: {
        label: "TPS range",
        max: 5000,
        min: 10,
        render: (get) => get("tpsMode") === "range",
        step: 10,
        value: [80, 400],
      },
      chunkSize: {
        label: "Chunk size (ch)",
        max: 100,
        min: 1,
        step: 1,
        value: 6,
      },
      jitter: { label: "Jitter (%)", max: 100, min: 0, step: 5, value: 50 },
      smoothing: {
        options: SMOOTHING_OPTIONS,
        value: "balanced" as StreamSmoothingPreset,
      },
      granularity: {
        options: GRANULARITY_OPTIONS,
        value: "char" as StreamAnimationGranularity,
      },
      latexGuard: { label: "LaTeX guard", value: true },
      preprocess: { label: "preprocessLaTeX", value: true },
    }),
    { store },
  );

  const {
    chunkSize,
    granularity,
    jitter,
    latexGuard,
    preprocess,
    sample,
    smoothing,
  } = controls;
  const sampleKey = sample as SampleKey;
  const ranged = controls.tpsMode === "range";
  const rateMin = ranged ? Math.min(...controls.tpsRange) : controls.tps;
  const rateMax = ranged ? Math.max(...controls.tpsRange) : controls.tps;

  // The paragraph-batch samples reproduce a specific upstream cadence, so they bring their own
  // chunk size and rate.
  useEffect(() => {
    if (!(sampleKey in paragraphBatchCases)) return;
    const preset =
      paragraphBatchCases[sampleKey as keyof typeof paragraphBatchCases];
    set({
      chunkSize: preset.chunkSize,
      jitter: 0,
      tps: Math.round((preset.chunkSize / preset.delayMs) * 1000),
      tpsMode: "fixed",
    });
  }, [sampleKey, set]);

  const profiler = useMemo(
    () => createStreamdownProfiler({ label: "playground" }),
    [],
  );
  const { restart, text } = useLocalStream(samples[sampleKey].content, {
    chunkSize,
    jitter: jitter / 100,
    tps: rateMin,
    tpsMax: rateMax,
  });
  const remarkPlugins = useMemo(() => [remarkGfm, remarkMath], []);
  const rehypePlugins = useMemo(() => [rehypeKatex], []);

  useEffect(() => {
    profiler.reset("playground");
  }, [
    profiler,
    sampleKey,
    chunkSize,
    rateMin,
    rateMax,
    jitter,
    smoothing,
    granularity,
    preprocess,
  ]);

  return (
    <StoryBook levaStore={store}>
      <Flexbox gap={12} padding={4} width={"100%"}>
        <StreamdownProfilerProvider profiler={profiler}>
          <StreamPane
            content={text}
            extra={<ProfilerRate profiler={profiler} />}
            granularity={granularity}
            height={420}
            latexGuard={latexGuard}
            preprocess={preprocess ? preprocessLaTeX : undefined}
            rehypePlugins={rehypePlugins}
            remarkPlugins={remarkPlugins}
            smoothing={smoothing}
            title={samples[sampleKey].label}
            onReplay={() => {
              profiler.reset("playground");
              restart();
            }}
          />
        </StreamdownProfilerProvider>
        <ProfilerPanel profiler={profiler} />
      </Flexbox>
    </StoryBook>
  );
};

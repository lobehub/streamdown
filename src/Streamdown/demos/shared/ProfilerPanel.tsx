import {
  type StreamdownProfiler,
  type StreamdownProfilerSnapshot,
} from "@lobehub/streamdown/profiler";
import { Block, Flexbox, Text } from "@lobehub/ui";
import { useSyncExternalStore } from "react";

import { useMainThreadLoad } from "./useMainThreadLoad";

const formatMs = (value: number) => {
  if (value >= 100) return value.toFixed(0);
  if (value >= 10) return value.toFixed(1);
  return value.toFixed(2);
};

const Stat = ({
  hint,
  label,
  unit,
  value,
}: {
  hint: string;
  label: string;
  unit: string;
  value: string;
}) => (
  <Block
    flex={1}
    gap={2}
    padding={10}
    style={{ minWidth: 120 }}
    variant={"filled"}
  >
    <Text fontSize={12} type={"secondary"}>
      {label}
    </Text>
    <Text
      fontSize={18}
      style={{ fontVariantNumeric: "tabular-nums" }}
      weight={600}
    >
      {value}
      <Text as={"span"} fontSize={12} type={"secondary"}>
        {" "}
        {unit}
      </Text>
    </Text>
    <Text fontSize={11} type={"secondary"}>
      {hint}
    </Text>
  </Block>
);

const useSnapshot = (
  profiler: StreamdownProfiler,
): StreamdownProfilerSnapshot =>
  useSyncExternalStore(
    profiler.subscribe,
    profiler.getSnapshot,
    profiler.getSnapshot,
  );

/** Live commit rate, e.g. for a header. */
export const ProfilerRate = ({
  profiler,
}: {
  profiler: StreamdownProfiler;
}) => {
  const { fps } = useSnapshot(profiler);

  return (
    <Text
      fontSize={12}
      style={{ fontVariantNumeric: "tabular-nums" }}
      type={"secondary"}
    >
      {fps.currentFps.toFixed(0)}/s commits · avg {fps.avgFps.toFixed(0)}
    </Text>
  );
};

/** Main-thread load plus the root, block, reveal-frame and input metrics of a profiler. */
export const ProfilerPanel = ({
  profiler,
}: {
  profiler: StreamdownProfiler;
}) => {
  const { animation, blocksAggregate, input, root } = useSnapshot(profiler);
  const { busy, peak, pressure } = useMainThreadLoad();

  return (
    <Flexbox horizontal gap={8} width={"100%"} wrap={"wrap"}>
      <Stat
        label={"Main thread"}
        unit={"%"}
        value={busy.toFixed(1)}
        hint={
          pressure
            ? `peak ${peak.toFixed(0)}% · cpu ${pressure}`
            : `peak ${peak.toFixed(0)}%`
        }
      />
      <Stat
        hint={`max ${formatMs(root.maxMs)} · ${root.updateCount} upd`}
        label={"Root commit"}
        unit={"ms"}
        value={formatMs(root.avgMs)}
      />
      <Stat
        hint={`max ${formatMs(blocksAggregate.maxMs)} · ${blocksAggregate.trackedCount} blk`}
        label={"Block commit"}
        unit={"ms"}
        value={formatMs(blocksAggregate.avgMs)}
      />
      <Stat
        hint={`${animation.revealFrameCount} rev · backlog ${animation.lastBacklog}`}
        label={"Reveal frame"}
        unit={"ms"}
        value={formatMs(animation.avgMs)}
      />
      <Stat
        hint={`${input.count} chunks · ${input.totalChars} ch`}
        label={"Input chunk"}
        unit={"ch"}
        value={input.avgChars.toFixed(1)}
      />
    </Flexbox>
  );
};

import { type StreamSmoothingPreset } from "@lobehub/streamdown";
import { Button, Flexbox, Grid, Icon } from "@lobehub/ui";
import { RotateCcw } from "lucide-react";

import { StreamPane } from "./shared/StreamPane";
import { useLocalStream } from "./shared/useLocalStream";

const SOURCE = `Upstream chunks arrive in bursts: sometimes one token, sometimes a whole sentence in one
network frame. The smoother buffers them and reveals characters at a steady pace, speeding up when
the buffer grows and draining the remainder once the stream goes quiet.

Each preset trades latency for calm: **realtime** keeps the smallest buffer, **balanced** is the
default, and **silky** holds the longest buffer for the steadiest flow.
`;

const PRESETS: StreamSmoothingPreset[] = ["realtime", "balanced", "silky"];

export default () => {
  // One bursty stream (big, jittery chunks) feeds all three presets.
  const { restart, text } = useLocalStream(SOURCE, {
    chunkSize: 40,
    jitter: 0.9,
    tps: 300,
  });

  return (
    <Flexbox gap={12} width={"100%"}>
      <Grid gap={12} maxItemWidth={200} rows={3}>
        {PRESETS.map((preset) => (
          <StreamPane
            content={text}
            height={260}
            key={preset}
            smoothing={preset}
            title={`smoothing="${preset}"`}
          />
        ))}
      </Grid>
      <Button
        icon={<Icon icon={RotateCcw} />}
        style={{ alignSelf: "flex-start" }}
        onClick={restart}
      >
        Replay all
      </Button>
    </Flexbox>
  );
};

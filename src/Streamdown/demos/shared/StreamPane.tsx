import { Streamdown, type StreamdownProps } from "@lobehub/streamdown";
import { Button, Flexbox, Icon, Typography } from "@lobehub/ui";
import { Surface } from "@lobehub/ui/dashboard";
import { RotateCcw } from "lucide-react";
import { type ReactNode } from "react";

import { markdownComponents } from "./markdownComponents";
import { useStickToBottom } from "./useStickToBottom";

export interface StreamPaneProps extends StreamdownProps {
  /** Extra controls rendered in the header, before the replay button. */
  extra?: ReactNode;
  /** Height of the scrolling output area in pixels. */
  height?: number;
  onReplay?: () => void;
  title?: ReactNode;
}

/** An auto-scrolling `<Streamdown />` output on a Lobe UI `Surface`, with a header and a replay button. */
export const StreamPane = ({
  extra,
  height = 320,
  onReplay,
  title,
  ...streamdownProps
}: StreamPaneProps) => {
  const { onScroll, ref } = useStickToBottom();

  return (
    <Surface
      padded={false}
      style={{ width: "100%" }}
      title={title}
      extra={
        <Flexbox horizontal align={"center"} gap={8}>
          {extra}
          {onReplay && (
            <Button
              icon={<Icon icon={RotateCcw} />}
              size={"small"}
              onClick={onReplay}
            >
              Replay
            </Button>
          )}
        </Flexbox>
      }
    >
      <div
        ref={ref}
        style={{
          height,
          overflowY: "auto",
          paddingBlock: 8,
          paddingInline: 16,
        }}
        onScroll={onScroll}
      >
        <Typography fontSize={14}>
          <Streamdown components={markdownComponents} {...streamdownProps} />
        </Typography>
      </div>
    </Surface>
  );
};

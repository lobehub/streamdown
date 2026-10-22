import { Streamdown, type StreamdownProps } from "@lobehub/streamdown";
import { Block, Button, Flexbox, Icon, Text, Typography } from "@lobehub/ui";
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

/** A framed, auto-scrolling `<Streamdown />` output with a header and a replay button. */
export const StreamPane = ({
  extra,
  height = 320,
  onReplay,
  title,
  ...streamdownProps
}: StreamPaneProps) => {
  const { onScroll, ref } = useStickToBottom();

  return (
    <Block style={{ overflow: "hidden" }} variant={"outlined"} width={"100%"}>
      <Flexbox
        horizontal
        align={"center"}
        gap={8}
        justify={"space-between"}
        paddingBlock={8}
        paddingInline={12}
      >
        <Text fontSize={12} type={"secondary"}>
          {title}
        </Text>
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
      </Flexbox>
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
    </Block>
  );
};

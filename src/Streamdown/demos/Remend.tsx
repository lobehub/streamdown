import { Flexbox, Grid, Highlighter } from "@lobehub/ui";

import { StreamPane } from "./shared/StreamPane";
import { useLocalStream } from "./shared/useLocalStream";

const SOURCE = `Mid-stream, markdown is almost always **unbalanced**: an emphasis that has not closed yet,
a \`code span\` still waiting for its backtick, a [link](https://github.com/lobehub/streamdown)
whose URL is half typed, or ~~strikethrough~~ that ends later.

remend completes those markers on the open tail block before it is parsed, so the reader sees
formatted text instead of raw asterisks and brackets.
`;

export default () => {
  const { restart, text } = useLocalStream(SOURCE, {
    chunkSize: 2,
    jitter: 0.2,
    tps: 60,
  });

  return (
    <Grid gap={12} maxItemWidth={280} rows={2}>
      <Flexbox gap={8}>
        <Highlighter
          language={"markdown"}
          style={{ height: 300, overflow: "auto" }}
          variant={"outlined"}
        >
          {text || " "}
        </Highlighter>
      </Flexbox>
      <StreamPane
        content={text}
        height={260}
        title={"Rendered"}
        onReplay={restart}
      />
    </Grid>
  );
};

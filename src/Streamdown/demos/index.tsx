import { Streamdown } from "@lobehub/streamdown";
import { Button, Flexbox, Typography } from "@lobehub/ui";
import { useEffect, useState } from "react";

const SOURCE = `## Hello, Streamdown

Streamdown renders **partial markdown** as it arrives: an open \`code span\`, a half-written [link](https://lobehub.com) or an unfinished list never flashes as raw syntax.

- Finished blocks are memoized
- Only the open tail block re-renders
- New characters fade in with CSS
`;

export default () => {
  const [content, setContent] = useState("");
  const [run, setRun] = useState(0);

  // Simulate an LLM stream: append four characters every 30ms.
  useEffect(() => {
    let position = 0;
    const timer = setInterval(() => {
      position = Math.min(SOURCE.length, position + 4);
      setContent(SOURCE.slice(0, position));
      if (position >= SOURCE.length) clearInterval(timer);
    }, 30);
    return () => clearInterval(timer);
  }, [run]);

  return (
    <Flexbox gap={12} width={"100%"}>
      <Typography>
        <Streamdown content={content} />
      </Typography>
      <Button
        style={{ alignSelf: "flex-start" }}
        onClick={() => setRun((n) => n + 1)}
      >
        Replay
      </Button>
    </Flexbox>
  );
};

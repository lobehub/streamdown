import { Highlighter, Mermaid } from "@lobehub/ui";
import {
  Children,
  type ComponentPropsWithoutRef,
  isValidElement,
  memo,
  type ReactElement,
  useEffect,
  useState,
} from "react";

/**
 * Highlighting and diagram rendering cost far more than a reveal commit, so neither runs while
 * the fence is still arriving: the block stays plain text until its source has held still, then
 * upgrades in place.
 */
const useSettled = (value: string, delay = 180) => {
  const [settled, setSettled] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setSettled(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return settled;
};

const PlainCode = ({ code }: { code: string }) => (
  <pre>
    <code>{code}</code>
  </pre>
);

const SettledMermaid = memo<{ code: string }>(({ code }) => {
  const settled = useSettled(code);
  if (settled !== code) return <PlainCode code={code} />;

  return <Mermaid variant={"filled"}>{code}</Mermaid>;
});

const SettledHighlighter = memo<{ code: string; language: string }>(
  ({ code, language }) => {
    const settled = useSettled(code);
    if (settled !== code) return <PlainCode code={code} />;

    return (
      <Highlighter language={language} variant={"filled"}>
        {code}
      </Highlighter>
    );
  },
);

const toText = (node: unknown): string => {
  if (typeof node === "string") return node;
  if (Array.isArray(node)) return node.map(toText).join("");
  if (isValidElement<{ children?: unknown }>(node))
    return toText(node.props.children);
  return "";
};

export const Pre = ({ children, ...rest }: ComponentPropsWithoutRef<"pre">) => {
  const child = Children.toArray(children).find((node) =>
    isValidElement<{ className?: string }>(node),
  ) as ReactElement<{ className?: string }> | undefined;

  const language = /language-([\w-]+)/.exec(child?.props.className ?? "")?.[1];
  if (!language) return <pre {...rest}>{children}</pre>;

  const code = toText(child).replace(/\n$/, "");
  if (language === "mermaid") return <SettledMermaid code={code} />;

  return <SettledHighlighter code={code} language={language} />;
};

/** `components` for `<Streamdown />`: fenced code goes through Lobe UI's Highlighter and Mermaid. */
export const markdownComponents = { pre: Pre };

import { renderMermaidSVG, type RenderOptions } from 'beautiful-mermaid';
import {
  Children,
  type ComponentPropsWithoutRef,
  isValidElement,
  memo,
  type ReactElement,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { codeToHtml } from 'shiki';

const MERMAID_OPTIONS: RenderOptions = {
  accent: 'var(--fg)',
  bg: 'var(--card)',
  border: 'var(--border-strong)',
  fg: 'var(--fg)',
  line: 'var(--fg-2)',
  muted: 'var(--fg-3)',
  surface: 'var(--bg-subtle)',
  transparent: true,
};

// Highlighting and diagram rendering are far more expensive than a reveal
// commit, so neither runs while Streamdown flags the fence as still
// streaming — the block stays plain text until it closes, then upgrades in
// place.
interface CodeProps {
  code: string;
  streaming: boolean;
}

const Mermaid = memo<CodeProps>(({ code, streaming }) => {
  const svg = useMemo(() => {
    if (streaming) return '';
    try {
      return renderMermaidSVG(code, MERMAID_OPTIONS);
    } catch {
      return '';
    }
  }, [code, streaming]);

  if (!svg) {
    return (
      <pre>
        <code>{code}</code>
      </pre>
    );
  }

  return <div className="mermaid" dangerouslySetInnerHTML={{ __html: svg }} />;
});

const Highlighted = memo<CodeProps & { language: string }>(({ code, language, streaming }) => {
  const [highlighted, setHighlighted] = useState({ code: '', html: '' });

  useEffect(() => {
    if (streaming) return;
    let cancelled = false;

    codeToHtml(code, {
      lang: language,
      themes: { dark: 'github-dark', light: 'github-light' },
    })
      .then((html) => !cancelled && setHighlighted({ code, html }))
      .catch(() => !cancelled && setHighlighted({ code: '', html: '' }));

    return () => {
      cancelled = true;
    };
  }, [code, language, streaming]);

  if (streaming || highlighted.code !== code) {
    return (
      <pre>
        <code>{code}</code>
      </pre>
    );
  }

  return <div className="highlighted" dangerouslySetInnerHTML={{ __html: highlighted.html }} />;
});

const toText = (node: unknown): string => {
  if (typeof node === 'string') return node;
  if (Array.isArray(node)) return node.map(toText).join('');
  if (isValidElement<{ children?: unknown }>(node)) return toText(node.props.children);
  return '';
};

export const Pre = ({ children, ...rest }: ComponentPropsWithoutRef<'pre'>) => {
  const streaming = Boolean((rest as Record<string, unknown>)['data-streaming']);
  const child = Children.toArray(children).find((node) =>
    isValidElement<{ className?: string }>(node),
  ) as ReactElement<{ className?: string }> | undefined;

  const language = /language-(\w+)/.exec(child?.props.className ?? '')?.[1];
  if (!language) return <pre {...rest}>{children}</pre>;

  const code = toText(child).replace(/\n$/, '');
  if (language === 'mermaid') return <Mermaid code={code} streaming={streaming} />;

  return <Highlighted code={code} language={language} streaming={streaming} />;
};

export const markdownComponents = { pre: Pre };

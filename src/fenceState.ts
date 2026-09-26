import { type Element, type Root } from 'hast';
import { visit } from 'unist-util-visit';
import { type VFile } from 'vfile';

/**
 * Walk `content` and return the language of the last *unclosed* fenced
 * code block, or `null` if every fence is closed (or there are none).
 *
 * Used by the smoother to decide whether to bypass its buffer for the
 * current input. CommonMark recognises an opening fence as a line whose
 * first non-space chars are 3+ backticks; we deliberately stay simple:
 * 3 literal backticks at line start, language word after. That covers
 * the markdown LLMs actually emit; tildes and indented fences fall back
 * to normal smoothing rather than getting clever.
 *
 * Linear scan over the input, ~10ns per char on V8. Called on every
 * smoothing tick during streaming so the simplicity matters.
 */
export const findOpenFenceLanguage = (content: string): string | null => {
  let inFence = false;
  let lang = '';
  let i = 0;
  const len = content.length;
  while (i < len) {
    const nl = content.indexOf('\n', i);
    const lineEnd = nl === -1 ? len : nl;
    const line = content.slice(i, lineEnd);
    if (line.startsWith('```')) {
      if (inFence) {
        inFence = false;
        lang = '';
      } else {
        inFence = true;
        lang = line.slice(3).trim().toLowerCase();
      }
    }
    if (nl === -1) break;
    i = nl + 1;
  }
  return inFence ? lang : null;
};

const FENCE_OPEN_RE = /^[\t >]*(`{3,}|~{3,})/;

const isUnclosedFence = (source: string): boolean => {
  const fence = FENCE_OPEN_RE.exec(source)?.[1];
  if (!fence) return false;
  const lastNewline = source.lastIndexOf('\n');
  if (lastNewline === -1) return true;
  const closing = source.slice(lastNewline + 1).replace(/^[\t >]*/, '').trimEnd();
  return closing.length < fence.length || [...closing].some((char) => char !== fence[0]);
};

// Marks the fenced code block that is still being streamed with
// `data-streaming`, so custom `pre` components can skip expensive work
// (highlighting, diagram rendering) until the fence closes. Only a fence
// that runs to the end of the source can still be open: an earlier one
// was closed explicitly or implicitly by its container ending.
export const rehypeStreamingFence = () => (tree: Root, file: VFile) => {
  const source = String(file.value);
  let last: Element | undefined;
  visit(tree, 'element', (node) => {
    if (node.tagName === 'pre') last = node;
  });
  const start = last?.position?.start.offset;
  const end = last?.position?.end.offset;
  if (!last || start === undefined || end === undefined) return;
  if (end < source.trimEnd().length) return;
  if (isUnclosedFence(source.slice(start, end))) last.properties.dataStreaming = true;
};

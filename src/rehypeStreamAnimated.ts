import { type Element, type ElementContent, type Root } from 'hast';
import { type BuildVisitor } from 'unist-util-visit';
import { visit } from 'unist-util-visit';

import { getNow } from './internal';
import { createStreamTailNode, type StreamTailData } from './StreamTail';
import { STREAM_INLINE_CLASS } from './styles';

export interface StreamBirthPacing {
  capMs: number;
  pace: number;
}

export interface StreamAnimatedRuntime {
  /**
   * Birth timestamp per rendered char, assigned on first render from
   * `pacing` (or supplied up front by legacy callers).
   */
  births: number[];
  /**
   * Inline code fades as one box starting at its first char's birth. The
   * delay is frozen at first render, keyed by that char's index, because a
   * changed animation-delay on a running animation jumps it.
   */
  inlineFades?: Map<number, { birth: number; delay: number }>;
  pacing?: StreamBirthPacing;
  /**
   * Per char, indexed like `births`: `undefined` = not rendered yet,
   * `true` = its fade window had already passed at first render, so it
   * shows fully revealed from the start.
   */
  skipped: (boolean | undefined)[];
}

export interface StreamAnimatedOptions {
  births?: number[];
  /** Fade a newly mounted complete block without creating per-character spans. */
  block?: boolean;
  fadeDuration?: number;
  /**
   * `'word'` wraps whitespace-delimited runs in one span instead of one
   * span per char. Every concurrent CSS animation keeps the compositor
   * producing frames and fires animationstart/end through React's root
   * event delegation, so animating ~5x fewer nodes is the main CPU lever —
   * char-level remains available for the finer-grained look.
   */
  granularity?: 'char' | 'word';
  nowMs?: number;
  revealed?: boolean;
  runtime?: StreamAnimatedRuntime;
}

// Intl.Segmenter splits CJK runs into words too — the whitespace regex
// fallback would otherwise fade an entire unspaced CJK paragraph as one
// unit.
const WORD_SEGMENT_RE = /\s+|\S+/g;

const wordSegmenter =
  typeof Intl !== 'undefined' && 'Segmenter' in Intl
    ? new Intl.Segmenter(undefined, { granularity: 'word' })
    : null;

const segmentWords = (value: string): string[] => {
  if (!wordSegmenter) return value.match(WORD_SEGMENT_RE) ?? [];

  const segments: string[] = [];
  for (const item of wordSegmenter.segment(value)) {
    segments.push(item.segment);
  }
  return segments;
};

// Chars born within one display frame are indistinguishable on screen, so
// they share a span: concurrent fades (each a composited layer) stay bounded
// by frames in flight instead of growing with stream throughput.
export const STREAM_FRAME_MS = 1000 / 60;

const frameOf = (birth: number) => Math.floor(birth / STREAM_FRAME_MS);

const BLOCK_TAGS = new Set(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'td', 'th']);
const SKIP_TAGS = new Set(['pre', 'code', 'svg']);

const classListOf = (node: Element): string[] => {
  const className = node.properties.className;
  if (Array.isArray(className)) return className.map(String);
  return className ? [String(className)] : [];
};

function hasClass(node: Element, cls: string): boolean {
  const cn: unknown = node.properties?.className;
  if (Array.isArray(cn)) return cn.some((c) => String(c).includes(cls));
  return false;
}

const noop = () => {};

export const rehypeStreamAnimated = (options: StreamAnimatedOptions = {}) => {
  const {
    block = false,
    births,
    fadeDuration = 150,
    granularity = 'char',
    nowMs,
    revealed = false,
    runtime,
  } = options;
  if (revealed) return noop;

  // Legacy births/nowMs callers share the runtime path through a throwaway
  // cache: the plugin factory runs once per render, so their styles are
  // recomputed against the caller's nowMs each run, exactly as before.
  const resolvedRuntime =
    runtime ??
    (Array.isArray(births) && typeof nowMs === 'number' ? { births, skipped: [] } : undefined);
  const nowOverride = runtime ? undefined : nowMs;

  return (tree: Root) => {
    if (block) {
      for (const node of tree.children) {
        if (node.type !== 'element') continue;
        node.properties.className = [...classListOf(node), 'stream-block'];
      }
      return;
    }
    let globalCharIndex = 0;
    const now = nowOverride ?? (resolvedRuntime ? getNow() : 0);

    const shouldSkip = (node: Element): boolean => {
      return SKIP_TAGS.has(node.tagName) || hasClass(node, 'katex');
    };

    const isSkipped = (index: number): boolean => {
      if (!resolvedRuntime) return false;
      const skipped = resolvedRuntime.skipped;
      if (skipped[index] === undefined) {
        const birthTs = resolvedRuntime.births[index];
        skipped[index] = birthTs === undefined || now - birthTs >= fadeDuration;
      }
      return skipped[index];
    };

    const ensureBirths = (from: number, count: number) => {
      const pacing = resolvedRuntime?.pacing;
      if (!resolvedRuntime || !pacing) return;
      const births = resolvedRuntime.births;
      for (let i = from; i < from + count; i++) {
        if (births[i] !== undefined) continue;
        const chained = i > 0 ? births[i - 1] + pacing.pace : now;
        births[i] = Math.min(now + pacing.capMs, Math.max(chained, now));
      }
    };

    const hasFaded = (index: number): boolean => {
      const birthTs = resolvedRuntime?.births[index];
      return (
        birthTs !== undefined && now - (frameOf(birthTs) + 1) * STREAM_FRAME_MS >= fadeDuration
      );
    };

    const wrapTextValue = (value: string): Element => {
      let text = '';
      const items: StreamTailData['items'] = [];
      let tailStarted = false;

      const mergeIntoFrame = (birth: number, segment: string): boolean => {
        const last = items.at(-1);
        const gap = typeof last === 'string' ? last : '';
        const group = gap ? items.at(-2) : last;
        if (!group || typeof group === 'string' || group.birth === null) return false;
        if (frameOf(group.birth) !== frameOf(birth)) return false;
        if (gap) items.pop();
        group.value += gap + segment;
        return true;
      };

      const push = (segment: string, startIndex: number, charCount: number, animate: boolean) => {
        ensureBirths(startIndex, charCount);
        if (animate) {
          if (isSkipped(startIndex)) {
            tailStarted = true;
            items.push({ birth: null, key: startIndex, value: segment });
            return;
          }
          if (!hasFaded(startIndex)) {
            tailStarted = true;
            const birth = resolvedRuntime?.births[startIndex] ?? now;
            if (mergeIntoFrame(birth, segment)) return;
            items.push({ birth, key: startIndex, value: segment });
            return;
          }
        }
        if (tailStarted) items.push(segment);
        else text += segment;
      };

      if (granularity === 'word') {
        for (const segment of segmentWords(value)) {
          const startIndex = globalCharIndex;
          for (const _char of segment) globalCharIndex++;
          push(segment, startIndex, globalCharIndex - startIndex, segment.trim() !== '');
        }
      } else {
        for (const char of value) {
          push(char, globalCharIndex, 1, true);
          globalCharIndex++;
        }
      }

      return createStreamTailNode({ items, text });
    };

    const inlineFadeDelay = (index: number): number | null => {
      const birth = resolvedRuntime?.births[index] ?? now;
      if (isSkipped(index) || now - birth >= fadeDuration) return null;
      if (!resolvedRuntime) return birth - now;
      const fades = (resolvedRuntime.inlineFades ??= new Map());
      const frozen = fades.get(index);
      if (frozen?.birth === birth) return frozen.delay;
      const delay = birth - now;
      fades.set(index, { birth, delay });
      return delay;
    };

    const wrapInlineCode = (node: Element) => {
      const startIndex = globalCharIndex;
      wrapText(node);
      if (globalCharIndex === startIndex) return;
      const delay = inlineFadeDelay(startIndex);
      if (delay === null) {
        resolvedRuntime?.inlineFades?.delete(startIndex);
        return;
      }
      node.properties.className = [...classListOf(node), STREAM_INLINE_CLASS];
      const style = node.properties.style;
      const fadeStyle = `animation-delay:${delay}ms`;
      node.properties.style = style ? `${String(style)};${fadeStyle}` : fadeStyle;
    };

    const wrapText = (node: Element) => {
      const newChildren: ElementContent[] = [];
      for (const child of node.children) {
        if (child.type === 'text') {
          newChildren.push(wrapTextValue(child.value));
        } else if (child.type === 'element') {
          if (child.tagName === 'code') {
            wrapInlineCode(child);
          } else if (!shouldSkip(child)) {
            wrapText(child);
          }
          newChildren.push(child);
        } else {
          newChildren.push(child);
        }
      }
      node.children = newChildren;
    };

    visit(tree, 'element', ((node: Element) => {
      if (shouldSkip(node)) return 'skip';
      if (BLOCK_TAGS.has(node.tagName)) {
        wrapText(node);
        return 'skip';
      }
    }) as BuildVisitor<Root, 'element'>);
  };
};

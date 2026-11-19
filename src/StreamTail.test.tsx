import { act, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { getNow } from './internal';
import { createStreamTailNode, StreamTail } from './StreamTail';
import { STREAM_FADE_DURATION } from './styles';

vi.mock('./internal', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./internal')>();
  return { ...actual, getNow: vi.fn(actual.getNow) };
});

const delayOf = (el: Element) => Number.parseFloat((el as HTMLElement).style.animationDelay);

describe('StreamTail', () => {
  it('freezes each delay per mounted instance and resumes from real elapsed time on remount', () => {
    const now = performance.now();
    const node = createStreamTailNode({
      items: [{ birth: now - 50, key: 3, value: 'x' }],
      text: 'ab',
    });

    const { container, rerender, unmount } = render(<StreamTail node={node} />);
    const first = delayOf(container.querySelector('.stream-char')!);
    expect(first).toBeLessThanOrEqual(-50);
    expect(first).toBeGreaterThan(-180);

    rerender(
      <StreamTail
        node={createStreamTailNode({
          items: [{ birth: now - 50, key: 3, value: 'x' }],
          text: 'ab',
        })}
      />,
    );
    expect(delayOf(container.querySelector('.stream-char')!)).toBe(first);
    unmount();

    const remounted = render(<StreamTail node={node} />);
    const later = delayOf(remounted.container.querySelector('.stream-char')!);
    expect(later).toBeLessThanOrEqual(first);
    expect(remounted.container.textContent).toBe('abx');
  });

  it('folds faded spans back into plain text once their fade ends', () => {
    vi.useFakeTimers();
    try {
      const now = 10_000;
      vi.mocked(getNow).mockReturnValue(now);
      const node = createStreamTailNode({
        items: [
          { birth: now, key: 2, value: 'c' },
          { birth: now + 40, key: 3, value: 'd' },
        ],
        text: 'ab',
      });
      const { container } = render(<StreamTail node={node} />);
      expect(container.querySelectorAll('.stream-char')).toHaveLength(2);

      vi.mocked(getNow).mockReturnValue(now + 40 + STREAM_FADE_DURATION);
      act(() => {
        vi.advanceTimersByTime(40 + STREAM_FADE_DURATION);
      });

      expect(container.querySelectorAll('span')).toHaveLength(0);
      expect(container.textContent).toBe('abcd');
    } finally {
      vi.mocked(getNow).mockReset();
      vi.useRealTimers();
    }
  });

  it('renders skipped chars as revealed spans without a delay', () => {
    const node = createStreamTailNode({ items: [{ birth: null, key: 0, value: 'x' }], text: '' });
    const { container } = render(<StreamTail node={node} />);
    const span = container.querySelector('.stream-char-revealed') as HTMLElement;
    expect(span.style.animationDelay).toBe('');
  });

  it('skips rendering when a fresh node carries the same tail data', () => {
    const data = () => ({
      items: ['x', { birth: 10, key: 4, value: 'y' }],
      text: 'ab',
    });
    const { container, rerender } = render(<StreamTail node={createStreamTailNode(data())} />);
    const renders = vi.mocked(getNow).mock.calls.length;

    rerender(<StreamTail node={createStreamTailNode(data())} />);
    expect(vi.mocked(getNow).mock.calls.length).toBe(renders);

    rerender(
      <StreamTail
        node={createStreamTailNode({
          ...data(),
          items: [...data().items, { birth: 20, key: 5, value: 'z' }],
        })}
      />,
    );
    expect(vi.mocked(getNow).mock.calls.length).toBe(renders + 1);
    expect(container.textContent).toBe('abxyz');
  });
});

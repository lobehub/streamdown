import { describe, expect, it } from 'vitest';

import { StreamdownStyles } from './styles';

describe('StreamdownStyles', () => {
  it('is memoised so parent re-renders do not re-render the static style tag', () => {
    expect((StreamdownStyles as unknown as { $$typeof: symbol }).$$typeof).toBe(
      Symbol.for('react.memo'),
    );
  });
});

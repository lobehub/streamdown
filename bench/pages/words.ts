import '@pierre/words/styles.css';

import { Markdown } from '@pierre/words/react';
import { createElement } from 'react';

import { mount } from './harness';

mount(({ value, active, animated }) =>
  createElement(
    Markdown,
    {
      animated: animated ? { animation: 'fadeIn', duration: 180 } : false,
      controls: false,
      isAnimating: active,
      lineNumbers: false,
      mode: 'streaming',
    },
    value,
  ),
);

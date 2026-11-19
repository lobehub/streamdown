import 'streamdown/styles.css';

import { createElement } from 'react';
import { Streamdown } from 'streamdown';

import { mount } from './harness';

mount(({ value, active, animated }) =>
  createElement(
    Streamdown,
    {
      animated: animated
        ? {
            animation: 'fadeIn',
            duration: 180,
            easing: 'ease-out',
            sep: 'word',
            stagger: 0,
          }
        : false,
      codeBlockMaxHeight: 0,
      controls: false,
      dir: 'ltr',
      isAnimating: active,
      lineNumbers: false,
      mode: 'streaming',
    } as never,
    value,
  ),
);

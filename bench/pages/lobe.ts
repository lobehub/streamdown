import { Streamdown } from '@lobehub/streamdown';
import { createElement } from 'react';

import { mount } from './harness';

const params = new URLSearchParams(location.search);
const granularity = params.get('granularity') === 'word' ? 'word' : 'char';
const smoothing = (params.get('smoothing') ?? 'balanced') as 'balanced' | 'realtime' | 'silky';

mount(({ value }) => createElement(Streamdown, { content: value, granularity, smoothing }));

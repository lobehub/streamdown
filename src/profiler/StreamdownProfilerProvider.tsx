'use client';

import { createContext, memo, type PropsWithChildren, useContext } from 'react';

import { type StreamdownProfiler } from './profiler';

const StreamdownProfilerContext = createContext<StreamdownProfiler | null>(null);

export interface StreamdownProfilerProviderProps {
  profiler?: StreamdownProfiler | null;
}

export const StreamdownProfilerProvider = memo<PropsWithChildren<StreamdownProfilerProviderProps>>(
  ({ children, profiler = null }) => {
    return (
      <StreamdownProfilerContext.Provider value={profiler}>{children}</StreamdownProfilerContext.Provider>
    );
  },
);

StreamdownProfilerProvider.displayName = 'StreamdownProfilerProvider';

export const useStreamdownProfiler = () => {
  return useContext(StreamdownProfilerContext);
};

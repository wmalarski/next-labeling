import React, { useCallback, useState } from "react";
import FramesContext from "./framesContext";

export interface FramesProviderProps {
  children: React.ReactNode | React.ReactNode[] | null;
}

export interface FramesProviderState {
  currentFrame: number;
  duration: number;
}

function frameToRange(frame: number, state: FramesProviderState): number {
  return Math.max(Math.min(frame, state.duration), 0);
}

export default function FramesProvider(
  props: FramesProviderProps,
): JSX.Element {
  const { children } = props;

  const [{ currentFrame, duration }, setState] = useState<FramesProviderState>({
    currentFrame: 0,
    duration: 100,
  });

  const setDuration = useCallback(
    (duration: number): void =>
      setState(state => ({
        currentFrame: frameToRange(state.currentFrame, state),
        duration,
      })),
    [],
  );

  const moveBy = useCallback(
    (value: number): void =>
      setState(state => ({
        ...state,
        currentFrame: frameToRange(state.currentFrame + value, state),
      })),
    [],
  );

  const moveTo = useCallback(
    (frame: number): void =>
      setState(state => ({
        ...state,
        currentFrame: frameToRange(frame, state),
      })),
    [],
  );

  return (
    <FramesContext.Provider
      value={{
        currentFrame,
        duration,
        setDuration,
        moveBy,
        moveTo,
      }}
    >
      {children}
    </FramesContext.Provider>
  );
}

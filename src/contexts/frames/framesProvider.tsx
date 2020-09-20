import React, { useCallback, useContext, useState } from "react";
import { trackObjectsUpdate } from "../../utils/labeling/updates";
import LabelingContext from "../labeling/labelingContext";
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

  const { history } = useContext(LabelingContext);

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
      setState(state => {
        const nextFrame = frameToRange(state.currentFrame + value, state);
        if (state.currentFrame !== nextFrame && (value === 1 || value === -1)) {
          history.setLabeling(data => ({
            message: "Objects tracked",
            data: trackObjectsUpdate(data, state.currentFrame, value),
          }));
        }
        return { ...state, currentFrame: nextFrame };
      }),
    [history],
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

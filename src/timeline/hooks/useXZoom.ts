import { useCallback, useState } from "react";
import { optionalClamp } from "../../visualization/functions";

export interface UseXZoomState {
  scaleX: number;
  stageX: number;
}

export interface UseXZoomResult extends UseXZoomState {
  handleReset: () => void;
  handleZoomIn: (x: number) => void;
  handleZoomOut: (x: number) => void;
  handleSetScaleX: (scaleX: number, x: number) => void;
}

export interface UseXZoomProps {
  step: number;
  min?: number;
  max?: number;
  default?: number;
}

function getNewXZoomState(
  newScaleX: number,
  x: number,
  old: UseXZoomState,
): UseXZoomState {
  const { scaleX, stageX } = old;
  const mouseX = x / scaleX - stageX / scaleX;
  const newStageX = -(mouseX - x / newScaleX) * newScaleX;
  return { scaleX: newScaleX, stageX: newStageX };
}

const defaultXZoomState: UseXZoomState = { scaleX: 1, stageX: 0 };

export default function useXZoom(props: UseXZoomProps): UseXZoomResult {
  const { step, min, max, default: defaultScale } = props;

  const [state, setState] = useState<UseXZoomState>({
    stageX: defaultXZoomState.stageX,
    scaleX: defaultScale ?? defaultXZoomState.scaleX,
  });

  const changeZoom = useCallback(
    (isZoomIn: boolean, x: number): void => {
      setState(value =>
        getNewXZoomState(
          optionalClamp(value.scaleX + step * (isZoomIn ? -1 : 1), min, max),
          x,
          value,
        ),
      );
    },
    [max, min, step],
  );

  const handleSetScaleX = useCallback(
    (newScaleX: number, x: number): void =>
      setState(value =>
        getNewXZoomState(optionalClamp(newScaleX, min, max), x, value),
      ),
    [max, min],
  );

  const handleReset = useCallback((): void => setState(defaultXZoomState), []);
  const handleZoomIn = useCallback((x: number): void => changeZoom(true, x), [
    changeZoom,
  ]);
  const handleZoomOut = useCallback((x: number): void => changeZoom(false, x), [
    changeZoom,
  ]);

  return {
    handleReset,
    handleSetScaleX,
    handleZoomIn,
    handleZoomOut,
    ...state,
  };
}

import { KonvaEventObject } from "konva/types/Node";
import { useCallback, useState } from "react";
import { Point2D } from "../types";

export interface UseZoomState {
  stageScale: number;
  stageX: number;
  stageY: number;
}

export interface UseZoomResult extends UseZoomState {
  handleWheel: (evt: KonvaEventObject<WheelEvent>) => void;
  handleReset: () => void;
  handleZoomIn: (center: Point2D) => void;
  handleZoomOut: (center: Point2D) => void;
}

export interface UseZoomProps {
  scaleBy: number;
}

export default function useZoom(props: UseZoomProps): UseZoomResult {
  const { scaleBy } = props;

  const [state, setState] = useState<UseZoomState>({
    stageScale: 1,
    stageX: 0,
    stageY: 0,
  });

  const changeZoom = useCallback(
    (isZoomIn: boolean, point: Point2D): void => {
      setState(value => {
        const { stageScale, stageX, stageY } = value;
        const mousePointTo = {
          x: point.x / stageScale - stageX / stageScale,
          y: point.y / stageScale - stageY / stageScale,
        };
        const newScale = isZoomIn ? stageScale * scaleBy : stageScale / scaleBy;

        return {
          stageScale: newScale,
          stageX: -(mousePointTo.x - point.x / newScale) * newScale,
          stageY: -(mousePointTo.y - point.y / newScale) * newScale,
        };
      });
    },
    [scaleBy],
  );

  const handleWheel = useCallback(
    e => {
      e.evt.preventDefault();

      const stage = e.target.getStage();
      const point = stage.getPointerPosition();

      changeZoom(e.evt.deltaY < 0, point);
    },
    [changeZoom],
  );

  const handleReset = useCallback(
    (): void =>
      setState({
        stageScale: 1,
        stageX: 0,
        stageY: 0,
      }),
    [],
  );
  const handleZoomIn = useCallback(
    (center: Point2D): void => changeZoom(true, center),
    [changeZoom],
  );
  const handleZoomOut = useCallback(
    (center: Point2D): void => changeZoom(false, center),
    [changeZoom],
  );

  return {
    handleWheel,
    handleReset,
    handleZoomIn,
    handleZoomOut,
    ...state,
  };
}

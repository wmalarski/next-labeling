import { KonvaEventObject } from "konva/types/Node";
import { useCallback, useState } from "react";

export interface UseZoomState {
  stageScale: number;
  stageX: number;
  stageY: number;
}

export interface UseZoomResult extends UseZoomState {
  handleWheel: (evt: KonvaEventObject<WheelEvent>) => void;
}

export interface UseZoomProps {
  enabled: boolean;
  scaleBy: number;
}

export default function useZoom(props: UseZoomProps): UseZoomResult {
  const { enabled, scaleBy } = props;

  const [state, setState] = useState<UseZoomState>({
    stageScale: 1,
    stageX: 0,
    stageY: 0,
  });

  const handleWheel = useCallback(
    e => {
      if (!enabled) return;

      e.evt.preventDefault();

      const stage = e.target.getStage();
      const oldScale = stage.scaleX();
      const mousePointTo = {
        x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
        y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
      };

      const newScale =
        e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;

      setState({
        stageScale: newScale,
        stageX:
          -(mousePointTo.x - stage.getPointerPosition().x / newScale) *
          newScale,
        stageY:
          -(mousePointTo.y - stage.getPointerPosition().y / newScale) *
          newScale,
      });
    },
    [enabled, scaleBy],
  );

  return {
    handleWheel,
    ...state,
  };
}

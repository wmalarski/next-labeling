import React from "react";
import { Layer, Stage } from "react-konva";
import useLabelingContext from "../../utils/labeling/hooks/useLabelingContext";
import useZoom from "../../utils/visualization/hooks/useZoom";
import Video from "./video";

export default function KonvaStage(): JSX.Element {
  const context = useLabelingContext();

  const { handleWheel, stageScale, stageX, stageY } = useZoom({
    enabled: true,
    scaleBy: 1.1,
  });

  return (
    <Stage
      width={500}
      height={500}
      onWheel={handleWheel}
      scaleX={stageScale}
      scaleY={stageScale}
      x={stageX}
      y={stageY}
    >
      <Layer>
        <Video context={context} />
      </Layer>
    </Stage>
  );
}

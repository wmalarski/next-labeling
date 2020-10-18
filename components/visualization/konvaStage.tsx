import React from "react";
import { Layer, Stage } from "react-konva";
import { applyLabelingFilters } from "../../utils/labeling/functions";

import useLabelingContext from "../../utils/labeling/hooks/useLabelingContext";
import { getEventRelativePosition } from "../../utils/visualization/functions";
import useDrawingTool from "../../utils/visualization/hooks/useDrawingTool";
import useToolContext from "../../utils/visualization/hooks/useToolContext";
import useZoom from "../../utils/visualization/hooks/useZoom";
import { ToolType } from "../../utils/visualization/types";
import { FinishedObject, InProgressObject } from "./konvaObject";
import ToolsHeader from "./toolsHeader";
import Video from "./video";

export default function KonvaStage(): JSX.Element {
  const context = useLabelingContext();
  const { filters } = context;
  const { currentFrame, objects, selected } = context.history.data;

  const { toolType } = useToolContext();
  const zoomAndPaneSelected = toolType === ToolType.ZOOM_AND_PANE;

  const {
    handleWheel,
    handleReset,
    handleZoomIn,
    handleZoomOut,
    stageScale,
    stageX,
    stageY,
  } = useZoom({
    enabled: zoomAndPaneSelected,
    scaleBy: 1.1,
  });

  const drawingTool = useDrawingTool();
  const { acceptPoint, pushPoint, builderState } = drawingTool.builderResult;
  const drawingSchema = drawingTool.field?.fieldSchema;
  const drawingStage = builderState.currentValue?.stage;
  const drawingValue = builderState.currentValue?.value;

  return (
    <div>
      <ToolsHeader
        onResetClicked={handleReset}
        onZoomInClicked={() => handleZoomIn({ x: 250, y: 250 })}
        onZoomOutlicked={() => handleZoomOut({ x: 250, y: 250 })}
      />
      <Stage
        width={500}
        height={500}
        onWheel={handleWheel}
        scaleX={stageScale}
        scaleY={stageScale}
        x={stageX}
        y={stageY}
      >
        <Layer
          draggable={zoomAndPaneSelected}
          onDragMove={() => void 0}
          onDragStart={() => void 0}
          onDragEnd={() => void 0}
          onMouseMove={e => {
            const point = getEventRelativePosition(e);
            if (!point) return;
            pushPoint(point, currentFrame);
          }}
          onClick={e => {
            const point = getEventRelativePosition(e);
            if (!point) return;
            acceptPoint(point, false, currentFrame);
          }}
          onDblClick={e => {
            const point = getEventRelativePosition(e);
            if (!point) return;
            acceptPoint(point, true, currentFrame);
          }}
        >
          <Video context={context} />
          {applyLabelingFilters(objects, filters).flatMap(object => {
            const isSelected = selected.some(sel => sel.objectId === object.id);
            return object.fields.map(field => (
              <FinishedObject
                key={field.id}
                isSelected={isSelected}
                object={object}
                field={field}
                frame={currentFrame}
              />
            ));
          })}
          {drawingSchema &&
            drawingTool.object &&
            drawingStage &&
            drawingValue && (
              <InProgressObject
                fieldSchema={drawingSchema}
                object={drawingTool.object}
                stage={drawingStage}
                value={drawingValue}
              />
            )}
        </Layer>
      </Stage>
    </div>
  );
}

import React, { useCallback, useMemo } from "react";
import { Layer, Stage } from "react-konva";

import { calculateNewValues } from "../../utils/editors/functions";
import { inFrameFilter, labelingFilter } from "../../utils/labeling/functions";
import useLabelingContext from "../../utils/labeling/hooks/useLabelingContext";
import usePreferences from "../../utils/labeling/hooks/usePreferencesContext";
import setAttributeUpdate from "../../utils/labeling/updates/setAttributeUpdate";
import setSelectedObjectUpdate from "../../utils/labeling/updates/setSelectedObjectUpdate";
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
  const { filters, history } = context;
  const { data, pushLabeling } = history;
  const { currentFrame, objects, selected } = data;

  const { toolType } = useToolContext();
  const zoomAndPaneSelected = toolType === ToolType.ZOOM_AND_PANE;
  const drawingToolSelected = toolType === ToolType.DRAWING_TOOL;

  const { preferences } = usePreferences();

  const {
    handleWheel,
    handleReset,
    handleZoomIn,
    handleZoomOut,
    stageScale,
    stageX,
    stageY,
  } = useZoom({ scaleBy: 1.1 });

  const width = 400;
  const height = 400;

  const drawingTool = useDrawingTool();
  const { acceptPoint, pushPoint, builderState } = drawingTool.builderResult;
  const drawingSchema = drawingTool.field?.fieldSchema;
  const drawingStage = builderState.currentValue?.stage;
  const drawingValue = builderState.currentValue?.value;

  const handleSelect = useCallback(
    (selectedId: string | null) =>
      pushLabeling(doc => setSelectedObjectUpdate(doc, selectedId)),
    [pushLabeling],
  );

  const filteredObjects = useMemo(
    () =>
      objects
        .filter(labelingFilter(filters))
        .filter(inFrameFilter(currentFrame)),
    [currentFrame, filters, objects],
  );

  return (
    <div>
      <ToolsHeader
        onResetClicked={handleReset}
        onZoomInClicked={() => handleZoomIn({ x: width / 2, y: height / 2 })}
        onZoomOutlicked={() => handleZoomOut({ x: width / 2, y: height / 2 })}
      />
      <Stage
        width={width}
        height={height}
        onWheel={handleWheel}
        scaleX={stageScale}
        scaleY={stageScale}
        x={stageX}
        y={stageY}
        style={{
          cursor: drawingToolSelected ? "pointer" : "inherit",
        }}
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
          {filteredObjects.flatMap(object => {
            const isSelected = selected.some(sel => sel.objectId === object.id);
            return object.fields.map(field => (
              <FinishedObject
                key={field.id}
                isSelected={isSelected}
                object={object}
                field={field}
                frame={currentFrame}
                onSelect={() => handleSelect(object.id)}
                onChange={newValue => {
                  pushLabeling(doc =>
                    setAttributeUpdate(
                      doc,
                      object.id,
                      field.id,
                      calculateNewValues(
                        field.values,
                        field.fieldSchema.perFrame,
                        newValue,
                        preferences.labelingDirection,
                      ),
                    ),
                  );
                }}
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

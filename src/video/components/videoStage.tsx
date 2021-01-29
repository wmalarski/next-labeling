import React, { useCallback, useMemo } from "react";
import { Layer, Stage } from "react-konva";
import { calculateNewValues } from "../../editors/functions";
import { getEventRelativePosition } from "../../visualization/functions";
import { UseZoomResult } from "../../visualization/hooks/useZoom";
import { MouseButton } from "../../visualization/types";
import { inFrameFilter, labelingFilter } from "../../workspace/functions";
import useDrawingTool from "../../workspace/hooks/useDrawingTool";
import useLabelingContext from "../../workspace/hooks/useLabelingContext";
import usePreferences from "../../workspace/hooks/usePreferencesContext";
import useToolContext from "../../workspace/hooks/useToolContext";
import { ToolType } from "../../workspace/types/client";
import addSelectedObjectUpdate from "../../workspace/updates/addSelectedObjectUpdate";
import setAttributeUpdate from "../../workspace/updates/setAttributeUpdate";
import setSelectedObjectUpdate from "../../workspace/updates/setSelectedObjectUpdate";
import setSelectedUpdate from "../../workspace/updates/setSelectedUpdate";
import {
  FinishedObject,
  InProgressObject,
} from "./objects/visualizationObject";
import VideoView from "./videoView";

export interface VideoStageProps {
  width: number;
  height: number;
  zoom: UseZoomResult;
}

export default function VideoStage(props: VideoStageProps): JSX.Element {
  const { width, height, zoom } = props;
  const { handleWheel, stageScale, stageX, stageY } = zoom;

  const context = useLabelingContext();
  const { history, filters } = context;
  const { data, pushLabeling } = history;
  const { currentFrame, selected, objects } = data;

  const { toolType } = useToolContext();
  const zoomAndPaneSelected = toolType === ToolType.ZOOM_AND_PANE;

  const { preferences } = usePreferences();

  const drawingTool = useDrawingTool();
  const { acceptPoint, pushPoint, builderState } = drawingTool.builderResult;
  const drawingSchema = drawingTool.field?.fieldSchema;
  const drawingStage = builderState.currentValue?.stage;
  const drawingValue = builderState.currentValue?.value;

  const handleSelect = useCallback(
    (id: string, reset: boolean) =>
      pushLabeling(doc =>
        reset
          ? setSelectedObjectUpdate(doc, id)
          : addSelectedObjectUpdate(doc, id),
      ),
    [pushLabeling],
  );

  const handleDeselect = useCallback(
    () => pushLabeling(doc => setSelectedUpdate(doc, [])),
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
    <Stage
      width={width}
      height={height}
      onWheel={handleWheel}
      scaleX={stageScale}
      scaleY={stageScale}
      x={stageX}
      y={stageY}
      onContextMenu={event => event.evt.preventDefault()}
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
          acceptPoint(point, e.evt.button === MouseButton.RIGHT, currentFrame);
        }}
      >
        <VideoView context={context} onClick={handleDeselect} />
        {filteredObjects.flatMap(object => {
          const isSelected = selected.some(sel => sel.objectId === object.id);
          return object.fields.map(field => (
            <FinishedObject
              key={field.id}
              isSelected={isSelected}
              object={object}
              field={field}
              frame={currentFrame}
              onSelect={handleSelect}
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
  );
}

// export default withResizeDetector(KonvaStage, {
//   refreshRate: 10000,
// });

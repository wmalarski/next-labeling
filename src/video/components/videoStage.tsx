import React, { useCallback, useMemo } from "react";
import { Layer, Stage } from "react-konva";
import { useSelector } from "react-redux";
import { useRootDispatch } from "../../common/redux/store";
import useDrawingTool from "../../editors/hooks/useDrawingTool";
import { toolTypeSelector } from "../../editors/redux/selectors";
import { LabelingFieldValues } from "../../editors/types";
import { getEventRelativePosition } from "../../visualization/functions";
import { UseZoomResult } from "../../visualization/hooks/useZoom";
import { MouseButton } from "../../visualization/types";
import { inFrameFilter, labelingFilter } from "../../workspace/functions";
import {
  currentFrameSelector,
  filtersSelector,
  objectsSelector,
  selectedObjectSelector,
} from "../../workspace/redux/selectors";
import {
  addSelectedObject,
  setAttribute,
  setSelected,
  setSelectedObject,
} from "../../workspace/redux/slice";
import {
  LabelingField,
  LabelingObject,
  ToolType,
} from "../../workspace/types/client";
import {
  FinishedObject,
  InProgressObject,
} from "../objects/visualizationObject";
import VideoView from "./videoView";

export interface VideoStageProps {
  width: number;
  height: number;
  zoom: UseZoomResult;
}

export default function VideoStage(props: VideoStageProps): JSX.Element {
  const { width, height, zoom } = props;
  const { handleWheel, stageScale, stageX, stageY } = zoom;

  const dispatch = useRootDispatch();
  const filters = useSelector(filtersSelector);
  const objects = useSelector(objectsSelector);
  const currentFrame = useSelector(currentFrameSelector);
  const toolType = useSelector(toolTypeSelector);
  const selected = useSelector(selectedObjectSelector);

  const zoomAndPaneSelected = toolType === ToolType.ZOOM_AND_PANE;

  const drawingTool = useDrawingTool();
  const { acceptPoint, pushPoint, builderState } = drawingTool.result;
  const drawingSchema = drawingTool.tool?.fieldSchema;
  const drawingStage = builderState.currentValue?.stage;
  const drawingValue = builderState.currentValue?.value;

  const handleSelect = useCallback(
    (id: string, reset: boolean): void =>
      void dispatch(reset ? setSelectedObject(id) : addSelectedObject(id)),
    [dispatch],
  );

  const handleDeselect = useCallback(
    (): void => void dispatch(setSelected([])),
    [dispatch],
  );

  const handleChange = useCallback(
    (
      newValues: LabelingFieldValues,
      object: LabelingObject,
      field: LabelingField,
    ) =>
      dispatch(
        setAttribute({
          objectId: object.id,
          fieldId: field.id,
          values: newValues,
        }),
      ),
    [dispatch],
  );

  const filteredObjects = useMemo(
    () =>
      objects
        .filter(labelingFilter(filters))
        .filter(inFrameFilter(currentFrame)),
    [objects, filters, currentFrame],
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
        <VideoView onClick={handleDeselect} />
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
              onChange={newValues => handleChange(newValues, object, field)}
            />
          ));
        })}
        {drawingSchema && drawingStage && drawingValue && (
          <InProgressObject
            fieldSchema={drawingSchema}
            stage={drawingStage}
            value={drawingValue}
          />
        )}
      </Layer>
    </Stage>
  );
}

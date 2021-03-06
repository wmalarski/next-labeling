import { useTheme } from "@material-ui/core";
import React, { useCallback, useMemo } from "react";
import { Layer, Line, Rect, Stage } from "react-konva";
import { useSelector } from "react-redux";
import { useRootDispatch } from "../../common/redux/store";
import { TooltipLabel } from "../../visualization/components/tooltipLabel";
import { useTooltipLabel } from "../../visualization/hooks/useTooltipLabel";
import { frameToRange, labelingFilter } from "../../workspace/functions";
import {
  currentFrameSelector,
  durationSelector,
  filtersSelector,
  objectsSelector,
  selectedObjectSelector,
  toggledObjectSelector,
} from "../../workspace/redux/selectors";
import {
  deselectObject,
  selectObject,
  setCurrentFrame,
  setToggled,
} from "../../workspace/redux/slice";
import { LabelingObject } from "../../workspace/types/client";
import { TimelineRowHeight, TimelineVerticalLineWidth } from "../constants";
import { getTimelineObjectConfigs } from "../functions";
import TimelineLabel from "../shapes/timelineLabel";
import TimelineObject from "../shapes/timelineObject";

export interface TimelineViewProps {
  width: number;
  scaleX: number;
  stageX: number;
}

function TimelineView(props: TimelineViewProps): JSX.Element {
  const { width, scaleX, stageX } = props;

  const theme = useTheme();
  const errorColor = theme.palette.error.light;
  const backgroundColor = theme.palette.background.default;

  const dispatch = useRootDispatch();
  const duration = useSelector(durationSelector);
  const filters = useSelector(filtersSelector);
  const objects = useSelector(objectsSelector);
  const toggled = useSelector(toggledObjectSelector);
  const selected = useSelector(selectedObjectSelector);
  const currentFrame = useSelector(currentFrameSelector);

  const handleSelect = useCallback(
    (object: LabelingObject, reset: boolean, fieldId?: string): void =>
      void dispatch(selectObject({ object, reset, fieldId })),
    [dispatch],
  );

  const handleDeselect = useCallback(
    (object: LabelingObject, reset: boolean, fieldId?: string): void =>
      void dispatch(deselectObject({ objectId: object.id, reset, fieldId })),
    [dispatch],
  );

  const handleFrameSelected = useCallback(
    (index: number): void =>
      void dispatch(
        setCurrentFrame({
          nextFrame: frameToRange(Number(index), duration),
        }),
      ),
    [duration, dispatch],
  );

  const handleToggle = useCallback(
    (id: string): void => void dispatch(setToggled(id)),
    [dispatch],
  );

  const filteredObjects = useMemo(
    () => objects.filter(labelingFilter(filters)),
    [objects, filters],
  );

  const configs = useMemo(
    () => getTimelineObjectConfigs(filteredObjects, toggled, duration),
    [duration, filteredObjects, toggled],
  );

  const height = useMemo(
    () =>
      TimelineRowHeight *
      configs
        .map(config => config.fieldBlocks.length + 1)
        .reduce<number>((a, b) => a + b, 0),
    [configs],
  );

  const selectedNodes = useMemo(
    () =>
      selected.flatMap(object => [
        ...(object.objectSelected ? [object.objectId] : []),
        ...object.fieldIds.map(field => `${object.objectId}|${field}`),
      ]),
    [selected],
  );

  const { refs, onMouseLeave, onPointMove } = useTooltipLabel({
    scaleX,
  });

  const arrowWidth = 30;
  const labelsWidth = 160;
  return (
    <Stage width={width} height={height}>
      <Layer x={labelsWidth + stageX} scaleX={scaleX}>
        {configs.map(config => (
          <TimelineObject
            key={config.object.id}
            rowHeight={TimelineRowHeight}
            duration={duration}
            selectedNodes={selectedNodes}
            {...config}
            onTooltipEnter={onPointMove}
            onTooltipLeave={onMouseLeave}
            onDeselect={handleDeselect}
            onFrameSelected={handleFrameSelected}
            onSelect={handleSelect}
          />
        ))}
      </Layer>
      <Layer x={labelsWidth + stageX}>
        <Line
          points={[
            (currentFrame + 0.5) * scaleX,
            0,
            (currentFrame + 0.5) * scaleX,
            height,
          ]}
          stroke={errorColor}
          strokeWidth={TimelineVerticalLineWidth}
        />
        <TooltipLabel refs={refs} />
      </Layer>
      <Layer>
        <Rect width={labelsWidth} height={height} fill={backgroundColor} />
        {configs.map(config => (
          <TimelineLabel
            key={config.object.id}
            rowHeight={TimelineRowHeight}
            arrowWidth={arrowWidth}
            horPadding={8}
            verPadding={14}
            onToggle={handleToggle}
            {...config}
          />
        ))}
      </Layer>
    </Stage>
  );
}

export default React.memo(TimelineView);

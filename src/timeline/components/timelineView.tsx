import { useTheme } from "@material-ui/core";
import React, { useMemo } from "react";
import { Layer, Line, Rect, Stage } from "react-konva";
import { useSelector } from "react-redux";
import { TooltipLabel } from "../../visualization/components/tooltipLabel";
import { useTooltipLabel } from "../../visualization/hooks/useTooltipLabel";
import { durationSelector } from "../../workspace/redux/selectors/common-selectors";
import {
  currentFrameSelector,
  filteredObjectSelector,
  selectedObjectSelector,
  toggledObjectSelector,
} from "../../workspace/redux/selectors/doc-selectors";
import { TimelineRowHeight, TimelineVerticalLineWidth } from "../constants";
import { getTimelineObjectConfigs } from "../functions";
import TimelineLabel from "./shapes/timelineLabel";
import TimelineObject from "./shapes/timelineObject";

export interface TimelineViewProps {
  width: number;
  scaleX: number;
  stageX: number;
}

export default function TimelineView(props: TimelineViewProps): JSX.Element {
  const { width, scaleX, stageX } = props;

  const duration = useSelector(durationSelector);
  const filteredObjects = useSelector(filteredObjectSelector);
  const toggled = useSelector(toggledObjectSelector);
  const selected = useSelector(selectedObjectSelector);
  const currentFrame = useSelector(currentFrameSelector);

  const theme = useTheme();
  const errorColor = theme.palette.error.light;
  const backgroundColor = theme.palette.background.default;

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
            {...config}
          />
        ))}
      </Layer>
    </Stage>
  );
}

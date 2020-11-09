import { useTheme } from "@material-ui/core";
import React from "react";
import { Rect } from "react-konva";
import { LabelingObject } from "../../utils/labeling/types/client";
import { TimelineObjectShapeConfig } from "../../utils/timeline/types";
import { getEventRelativePosition } from "../../utils/visualization/functions";
import TimelineFieldShape from "./timelineFieldShape";
import TimelineRow from "./timelineRow";

export interface TimelineObjectShapeProps extends TimelineObjectShapeConfig {
  duration: number;
  rowHeight: number;
  selectedNodes: string[];
  onSelect: (object: LabelingObject, reset: boolean, field?: string) => void;
  onDeselect: (object: LabelingObject, reset: boolean, field?: string) => void;
  onFrameSelected: (index: number) => void;
}

export default function TimelineObjectShape(
  props: TimelineObjectShapeProps,
): JSX.Element {
  const {
    duration,
    rowHeight,
    row,
    object,
    objectBlocks,
    fieldBlocks,
    selectedNodes,
    onSelect,
    onDeselect,
    onFrameSelected,
  } = props;
  const isSelected = selectedNodes.includes(object.id);

  const theme = useTheme();
  const selectionColor = theme.palette.primary.light;
  const deselectionColor = theme.palette.primary.dark;

  return (
    <>
      <TimelineRow
        duration={duration}
        isSelected={isSelected}
        row={row}
        rowHeight={rowHeight}
        onClick={event => {
          if (event.evt.altKey) {
            const position = getEventRelativePosition(event);
            if (position) onFrameSelected(position.x);
            return;
          }
          const isReset = !event.evt.ctrlKey;
          if (!isSelected) onSelect(object, isReset);
          else onDeselect(object, isReset);
        }}
      >
        {objectBlocks.map(block => (
          <Rect
            key={block.firstFrame}
            x={block.firstFrame}
            width={block.lastFrame + 1 - block.firstFrame}
            height={rowHeight - 3}
            fill={isSelected ? selectionColor : deselectionColor}
          />
        ))}
      </TimelineRow>
      {fieldBlocks.map((pair, index) => (
        <TimelineFieldShape
          key={pair.field.id}
          {...pair}
          row={row + index + 1}
          duration={duration}
          rowHeight={rowHeight}
          object={object}
          selectedNodes={selectedNodes}
          onSelect={onSelect}
          onDeselect={onDeselect}
          onFrameSelected={onFrameSelected}
        />
      ))}
    </>
  );
}

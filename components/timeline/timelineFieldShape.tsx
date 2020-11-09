import React from "react";
import { Rect } from "react-konva";
import {
  darkerTimelineColors,
  lighterColors,
} from "../../themes/timelineColors";
import {
  LabelingField,
  LabelingObject,
} from "../../utils/labeling/types/client";
import { FieldBlock } from "../../utils/timeline/types";
import { getEventRelativePosition } from "../../utils/visualization/functions";
import TimelineRow from "./timelineRow";

export interface TimelineFieldShapeProps {
  row: number;
  object: LabelingObject;
  field: LabelingField;
  fieldBlocks: FieldBlock[];
  duration: number;
  rowHeight: number;
  selectedNodes: string[];
  onSelect: (object: LabelingObject, reset: boolean, field?: string) => void;
  onDeselect: (object: LabelingObject, reset: boolean, field?: string) => void;
  onFrameSelected: (index: number) => void;
}

export default function TimelineFieldShape(
  props: TimelineFieldShapeProps,
): JSX.Element {
  const {
    object,
    row,
    rowHeight,
    fieldBlocks,
    duration,
    field,
    selectedNodes,
    onSelect,
    onDeselect,
    onFrameSelected,
  } = props;
  const { id } = field;
  const nodeId = `${object.id}|${id}`;
  const isFieldSelected = selectedNodes.includes(nodeId);

  return (
    <TimelineRow
      duration={duration}
      isSelected={isFieldSelected}
      row={row}
      rowHeight={rowHeight}
      onClick={event => {
        if (event.evt.altKey) {
          const position = getEventRelativePosition(event);
          if (position) onFrameSelected(position.x);
          return;
        }
        const isReset = !event.evt.ctrlKey;
        if (!isFieldSelected) onSelect(object, isReset, id);
        else onDeselect(object, isReset, id);
      }}
    >
      {fieldBlocks.map(block => (
        <Rect
          key={block.firstFrame}
          x={block.firstFrame}
          width={block.lastFrame + 1 - block.firstFrame}
          height={rowHeight - 3}
          fill={
            isFieldSelected
              ? lighterColors[block.index]
              : darkerTimelineColors[block.index]
          }
        />
      ))}
    </TimelineRow>
  );
}

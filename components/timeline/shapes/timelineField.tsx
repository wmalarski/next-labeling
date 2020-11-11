import React from "react";
import {
  LabelingField,
  LabelingObject,
} from "../../../utils/labeling/types/client";
import { FieldBlock } from "../../../utils/timeline/types";
import { getEventRelativePosition } from "../../../utils/visualization/functions";
import { Point2D } from "../../../utils/visualization/types";
import TimelineFieldRect from "./timelineFieldRect";
import TimelineRow from "./timelineRow";

export interface TimelineFieldProps {
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
  onTooltipEnter: (point: Point2D, text: string) => void;
  onTooltipLeave: () => void;
}

export default function TimelineField(props: TimelineFieldProps): JSX.Element {
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
    onTooltipEnter,
    onTooltipLeave,
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
        <TimelineFieldRect
          key={block.firstFrame}
          block={block}
          field={field}
          isSelected={isFieldSelected}
          row={row}
          rowHeight={rowHeight}
          onTooltipEnter={onTooltipEnter}
          onTooltipLeave={onTooltipLeave}
        />
      ))}
    </TimelineRow>
  );
}

import React from "react";
import { Rect } from "react-konva";
import {
  darkerTimelineColors,
  lighterColors,
} from "../../themes/timelineColors";
import {
  LabelingField,
  LabelingObject,
  ObjectSelection,
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
  selection?: ObjectSelection;
  onSelect: (
    id: string,
    selection: ObjectSelection | null,
    reset: boolean,
  ) => void;
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
    selection,
    field,
    onSelect,
    onFrameSelected,
  } = props;
  const { id } = field;
  const isFieldSelected = selection?.fieldIds.includes(id) ?? false;

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
        if (isFieldSelected && selection) {
          onSelect(
            object.id,
            isReset
              ? null
              : {
                  ...selection,
                  fieldIds: selection.fieldIds.filter(f => f !== id),
                },
            isReset,
          );
          return;
        }

        onSelect(
          object.id,
          {
            objectId: object.id,
            singleton: object.objectSchema.singleton,
            objectSelected:
              isReset || !selection ? false : selection.objectSelected,
            fieldIds:
              isReset || !selection ? [id] : [...selection.fieldIds, id],
          },
          isReset,
        );
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

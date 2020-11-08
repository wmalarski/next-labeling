import { useTheme } from "@material-ui/core";
import React from "react";
import { Rect } from "react-konva";
import { ObjectSelection } from "../../utils/labeling/types/client";
import { TimelineObjectShapeConfig } from "../../utils/timeline/types";
import { getEventRelativePosition } from "../../utils/visualization/functions";
import TimelineFieldShape from "./timelineFieldShape";
import TimelineRow from "./timelineRow";

export interface TimelineObjectShapeProps extends TimelineObjectShapeConfig {
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

export default function TimelineObjectShape(
  props: TimelineObjectShapeProps,
): JSX.Element {
  const {
    selection,
    duration,
    rowHeight,
    row,
    object,
    objectBlocks,
    fieldBlocks,
    onSelect,
    onFrameSelected,
  } = props;
  const { id, objectSchema } = object;
  const isSelected = selection?.objectSelected ?? false;

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
          if (isSelected) {
            onSelect(id, null, isReset);
            return;
          }

          const newSelection = {
            fieldIds: [],
            objectId: id,
            objectSelected: true,
            singleton: objectSchema.singleton,
          };
          onSelect(
            id,
            isReset
              ? newSelection
              : { ...newSelection, ...selection, objectSelected: true },
            isReset,
          );
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
          selection={selection}
          onSelect={onSelect}
          onFrameSelected={onFrameSelected}
        />
      ))}
    </>
  );
}

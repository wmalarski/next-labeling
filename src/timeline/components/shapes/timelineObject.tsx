import { useTheme } from "@material-ui/core";
import React from "react";
import { Rect } from "react-konva";
import { getEventRelativePosition } from "../../../visualization/functions";
import { Point2D } from "../../../visualization/types";
import { LabelingObject } from "../../../workspace/types/client";
import { TimelineObjectConfig } from "../../types";
import TimelineField from "./timelineField";
import TimelineRow from "./timelineRow";

export interface TimelineObjectProps extends TimelineObjectConfig {
  duration: number;
  rowHeight: number;
  selectedNodes: string[];
  onTooltipEnter: (point: Point2D, text: string) => void;
  onTooltipLeave: () => void;
  onSelect: (object: LabelingObject, reset: boolean, fieldId?: string) => void;
  onDeselect: (
    object: LabelingObject,
    reset: boolean,
    fieldId?: string,
  ) => void;
  onFrameSelected: (index: number) => void;
}

export default function TimelineObject(
  props: TimelineObjectProps,
): JSX.Element {
  const {
    duration,
    rowHeight,
    row,
    object,
    objectBlocks,
    fieldBlocks,
    selectedNodes,
    onTooltipEnter,
    onTooltipLeave,
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
            y={row * rowHeight}
            width={block.lastFrame + 1 - block.firstFrame}
            height={rowHeight - 3}
            fill={isSelected ? selectionColor : deselectionColor}
          />
        ))}
      </TimelineRow>
      {fieldBlocks.map((pair, index) => (
        <TimelineField
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
          onTooltipEnter={onTooltipEnter}
          onTooltipLeave={onTooltipLeave}
        />
      ))}
    </>
  );
}

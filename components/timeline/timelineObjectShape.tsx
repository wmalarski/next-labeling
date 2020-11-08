import { useTheme } from "@material-ui/core";
import Konva from "konva";
import React, { useMemo, useRef } from "react";
import { Group, Rect } from "react-konva";
import { ObjectSelection } from "../../utils/labeling/types/client";
import { TimelineHoverStroke } from "../../utils/timeline/constansts";
import useMouseHover from "../../utils/timeline/hooks/useMouseHover";
import { TimelineObjectShapeConfig } from "../../utils/timeline/types";
import { getEventRelativePosition } from "../../utils/visualization/functions";
import TimelineFieldShape from "./timelineFieldShape";

export interface TimelineObjectShapeProps extends TimelineObjectShapeConfig {
  duration: number;
  rowHeight: number;
  selection?: ObjectSelection;
  onSelect: (selection: ObjectSelection, reset: boolean) => void;
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
  const hoverStrokeColor = theme.palette.text.primary;

  const rectRef = useRef<Konva.Rect>(null);
  const fillRef = useRef<Konva.Rect>(null);

  const hoverProps = useMemo(() => ({ strokeWidth: TimelineHoverStroke }), []);
  const outProps = useMemo(() => ({ strokeWidth: 0 }), []);
  const hoverCallbacks = useMouseHover(rectRef, hoverProps, outProps);

  return (
    <>
      <Group
        x={0}
        {...hoverCallbacks}
        onClick={event => {
          if (isSelected) {
            const position = getEventRelativePosition(event);
            if (position) onFrameSelected(position.x);
          } else {
            onSelect(
              selection ?? {
                fieldIds: [],
                objectId: id,
                objectSelected: true,
                singleton: objectSchema.singleton,
              },
              !event.evt.ctrlKey,
            );
          }
        }}
      >
        {objectBlocks.map(block => (
          <Rect
            key={block.firstFrame}
            ref={rectRef}
            x={block.firstFrame}
            y={row * rowHeight}
            width={block.lastFrame + 1 - block.firstFrame}
            height={rowHeight}
            fill={isSelected ? selectionColor : deselectionColor}
          />
        ))}
        <Rect
          ref={rectRef}
          x={0}
          y={row * rowHeight}
          height={rowHeight - 3}
          width={duration}
          stroke={hoverStrokeColor}
          strokeWidth={0}
          dash={[2, 2]}
        />
        <Rect
          ref={fillRef}
          x={0}
          y={row * rowHeight}
          height={rowHeight - 3}
          width={duration}
          fill={isSelected ? selectionColor : deselectionColor}
          opacity={0.1}
        />
      </Group>
      {fieldBlocks.map((pair, index) => (
        <TimelineFieldShape
          key={pair.field.id}
          {...pair}
          isSelected={isSelected}
          row={row + index + 1}
          duration={duration}
          rowHeight={rowHeight}
        />
      ))}
    </>
  );
}

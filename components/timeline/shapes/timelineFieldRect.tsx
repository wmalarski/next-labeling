import Konva from "konva";
import React, { useRef } from "react";
import { Rect } from "react-konva";
import {
  darkerTimelineColors,
  lighterColors,
} from "../../../themes/timelineColors";
import { LabelingField } from "../../../utils/labeling/types/client";
import { FieldBlock } from "../../../utils/timeline/types";
import { getEventRelativePosition } from "../../../utils/visualization/functions";
import useMouseHover from "../../../utils/visualization/hooks/useMouseHover";
import { Point2D } from "../../../utils/visualization/types";

export interface TimelineFieldRectProps {
  isSelected: boolean;
  field: LabelingField;
  rowHeight: number;
  block: FieldBlock;
  onTooltipEnter: (pos: Point2D, text: string) => void;
  onTooltipLeave: () => void;
}

const hoverProps = { strokeWidth: 3 };
const outProps = { strokeWidth: 0 };

export default function TimelineFieldRect(
  props: TimelineFieldRectProps,
): JSX.Element {
  const {
    isSelected,
    rowHeight,
    block,
    field,
    onTooltipEnter,
    onTooltipLeave,
  } = props;
  const { firstFrame, lastFrame, index } = block;
  const darker = darkerTimelineColors[index];
  const fill = isSelected ? lighterColors[index] : darker;

  const rectRef = useRef<Konva.Rect>(null);
  const { onMouseEnter, onMouseLeave } = useMouseHover(
    rectRef,
    hoverProps,
    outProps,
  );

  return (
    <Rect
      ref={rectRef}
      key={firstFrame}
      x={firstFrame}
      width={lastFrame + 1 - firstFrame}
      height={rowHeight - 3}
      fill={fill}
      stroke={darker}
      onMouseEnter={event => {
        onMouseEnter(event);
        const position = getEventRelativePosition(event);
        if (!position) return;
        onTooltipEnter(position, `${field.fieldSchema.name}: ${block.value}`);
      }}
      onMouseLeave={event => {
        onMouseLeave(event);
        onTooltipLeave();
      }}
    />
  );
}

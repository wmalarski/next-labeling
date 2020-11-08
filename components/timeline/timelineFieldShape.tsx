import React from "react";
import { Rect } from "react-konva";
import {
  darkerTimelineColors,
  lighterColors,
} from "../../themes/timelineColors";
import { LabelingField } from "../../utils/labeling/types/client";
import { FieldBlock } from "../../utils/timeline/types";

export interface TimelineFieldShapeProps {
  isSelected: boolean;
  row: number;
  field: LabelingField;
  fieldBlocks: FieldBlock[];
  duration: number;
  rowHeight: number;
}

export default function TimelineFieldShape(
  props: TimelineFieldShapeProps,
): JSX.Element {
  const { isSelected, row, rowHeight, fieldBlocks } = props;

  return (
    <>
      {fieldBlocks.map(block => (
        <Rect
          key={block.firstFrame}
          x={block.firstFrame}
          y={row * rowHeight}
          width={block.lastFrame + 1 - block.firstFrame}
          height={rowHeight}
          fill={
            isSelected
              ? lighterColors[block.index]
              : darkerTimelineColors[block.index]
          }
        />
      ))}
    </>
  );
}

import React from "react";
import { Label, Tag, Text } from "react-konva";
import { ObjectSelection } from "../../utils/labeling/types/client";
import { TimelineObjectShapeConfig } from "../../utils/timeline/types";

export interface TimelineObjectTextProps extends TimelineObjectShapeConfig {
  scaleX: number;
  rowHeight: number;
  selection?: ObjectSelection;
  onSelect: (id: string, selection: ObjectSelection, reset: boolean) => void;
}

export default function TimelineObjectText(
  props: TimelineObjectTextProps,
): JSX.Element {
  const { scaleX, rowHeight, row, object, objectBlocks } = props;
  const { name } = object;

  return (
    <Label x={objectBlocks[0]?.firstFrame * scaleX} y={row * rowHeight}>
      <Tag fill="black" opacity={0.3} />
      <Text
        text={name}
        fontSize={rowHeight / 2}
        height={rowHeight - 4}
        fill="white"
        padding={2}
      />
    </Label>
  );
}

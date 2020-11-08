import React from "react";
import { Label, Tag, Text } from "react-konva";
import { ObjectSelection } from "../../utils/labeling/types/client";
import { TimelineObjectShapeConfig } from "../../utils/timeline/types";

export interface TimelineObjectTextProps extends TimelineObjectShapeConfig {
  scaleX: number;
  rowHeight: number;
  selection?: ObjectSelection;
  onSelect: (selection: ObjectSelection, reset: boolean) => void;
  onToggle: (id: string) => void;
}

export default function TimelineObjectText(
  props: TimelineObjectTextProps,
): JSX.Element {
  const {
    scaleX,
    selection,
    rowHeight,
    row,
    object,
    objectBlocks,
    onSelect,
    onToggle,
  } = props;
  const { id, objectSchema, name } = object;

  return (
    <Label
      x={objectBlocks[0]?.firstFrame * scaleX}
      y={row * rowHeight}
      onClick={event =>
        onSelect(
          selection ?? {
            fieldIds: [],
            objectId: id,
            objectSelected: true,
            singleton: objectSchema.singleton,
          },
          !event.evt.ctrlKey,
        )
      }
      onDblClick={() => onToggle(id)}
    >
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

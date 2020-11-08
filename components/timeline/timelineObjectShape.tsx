import { useTheme } from "@material-ui/core";
import Konva from "konva";
import React, { useRef } from "react";
import { Group, Label, Rect, Tag, Text } from "react-konva";
import { ObjectSelection } from "../../utils/labeling/types/client";
import { TimelineHoverStroke } from "../../utils/timeline/constansts";
import { TimelineObjectShapeConfig } from "../../utils/timeline/types";
import TimelineFieldShape from "./timelineFieldShape";

export interface TimelineObjectShapeProps extends TimelineObjectShapeConfig {
  duration: number;
  rowHeight: number;
  selection?: ObjectSelection;
  onSelect: (selection: ObjectSelection, reset: boolean) => void;
  onToggle: (id: string) => void;
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
    onToggle,
  } = props;
  const { id, objectSchema, name } = object;
  const isSelected = selection?.objectSelected ?? false;

  const theme = useTheme();
  const selectionColor = theme.palette.primary.light;
  const deselectionColor = theme.palette.primary.dark;

  const rectRef = useRef<Konva.Rect>(null);
  const fillRef = useRef<Konva.Rect>(null);

  return (
    <>
      <Group
        x={0}
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
        onMouseEnter={() => {
          rectRef.current?.strokeWidth(TimelineHoverStroke);
          rectRef.current?.getLayer()?.batchDraw();
        }}
        onMouseLeave={() => {
          rectRef.current?.strokeWidth(0);
          rectRef.current?.getLayer()?.batchDraw();
        }}
        onMouseOut={() => {
          rectRef.current?.strokeWidth(0);
          rectRef.current?.getLayer()?.batchDraw();
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
          stroke="black"
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
        <Label x={objectBlocks[0]?.firstFrame} y={row * rowHeight}>
          <Tag fill="black" opacity={0.3} />
          <Text
            text={name}
            fontSize={rowHeight / 2}
            height={rowHeight - 4}
            fill="white"
            padding={2}
          />
        </Label>
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
  // return (
  //   <TreeItem
  //     onLabelClick={event => event.preventDefault()}
  //     label={
  //       <ObjectCanvas
  //         object={object}
  //         blocks={blocks}
  //         width={width}
  //         height={height}
  //         shiftX={shiftX}
  //         fontSize={fontSize}
  //         isSelected={isObjectSelected}
  //       />
  //     }
  //   >
  //     {fields.map(field => {
  //       const nodeId = `${object.id}|${field.id}`;
  //       const isFieldSelected = selected.includes(nodeId);
  //       return (
  //         <TreeItem
  //           nodeId={nodeId}
  //           key={field.id}
  //           label={
  //             <FieldCanvas
  //               field={field}
  //               blocks={blocks}
  //               width={width}
  //               height={height}
  //               shiftX={shiftX - fieldOffset}
  //               isSelected={isFieldSelected}
  //               fontSize={fontSize}
  //             />
  //           }
  //         />
  //       );
  //     })}
  //   </TreeItem>
  // );
}

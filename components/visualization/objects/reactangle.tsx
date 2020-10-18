import Konva from "konva";
import React, { useEffect, useRef, useState } from "react";
import { Rect, Transformer, Text } from "react-konva";

import { getFieldValue } from "../../../utils/editors/functions";
import { FieldType } from "../../../utils/editors/types";
import {
  FontSize,
  SelectedStrokeWidth,
  UnselectedStrokeWidth,
} from "../../../utils/visualization/constanst";
import { RectangleBuilderStage } from "../../../utils/visualization/objects/rectangle";
import {
  FinishedObjectProps,
  InProgressObjectProps,
} from "../../../utils/visualization/types";

export function RectangleInProgress(
  props: InProgressObjectProps,
): JSX.Element | null {
  const rectangle = props.value.Rectangle;
  if (!rectangle) return null;
  const value = rectangle[0].value;
  if (!value || props.stage <= RectangleBuilderStage.ONE_POINT) return null;

  const [x1, y1, x2, y2] = value;
  const [minX, maxX] = [x1, x2].sort();
  const [minY, maxY] = [y1, y2].sort();

  return (
    <Rect
      x={minX}
      y={minY}
      width={maxX - minX}
      height={maxY - minY}
      stroke="red"
    />
  );
}

export function RectangleFinished(
  props: FinishedObjectProps,
): JSX.Element | null {
  const { frame, field, isSelected, object, onSelect, onChange } = props;
  const { isDone, name } = object;
  const perFrame = field.fieldSchema.perFrame;
  const values = getFieldValue({
    values: field.values,
    perFrame,
    frame,
  })?.Rectangle;

  const [isTextVisible, setIsTextVisible] = useState(true);
  const textRef = useRef<Konva.Text>(null);
  const shapeRef = useRef<Konva.Rect>(null);
  const trRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (!isSelected || !trRef.current || !shapeRef.current || !textRef.current)
      return;
    trRef.current.nodes([shapeRef.current]);
    trRef.current.getLayer()?.batchDraw();
  }, [isSelected]);

  if (!values || !values[0].value) return null;

  const [x1, y1, x2, y2] = values[0].value;
  const [minX, maxX] = [x1, x2].sort((a, b) => a - b);
  const [minY, maxY] = [y1, y2].sort((a, b) => a - b);
  const width = maxX - minX;
  const height = maxY - minY;

  return (
    <>
      {isTextVisible && (
        <Text
          ref={textRef}
          x={minX}
          y={minY}
          text={name}
          width={width}
          align="center"
          fontSize={FontSize}
        />
      )}
      <Rect
        ref={shapeRef}
        x={minX}
        y={minY}
        width={width}
        height={height}
        draggable={!isDone}
        stroke="red"
        strokeScaleEnabled={false}
        strokeWidth={isSelected ? SelectedStrokeWidth : UnselectedStrokeWidth}
        onClick={onSelect}
        onTap={onSelect}
        onDragStart={() => setIsTextVisible(false)}
        onDragEnd={e => {
          setIsTextVisible(true);
          const x = e.target.x();
          const y = e.target.y();
          onChange({
            [FieldType.RECTANGLE]: [
              {
                frame,
                value: [x, y, x + width, y + height],
              },
            ],
          });
        }}
        onTransformEnd={() => {
          const node = shapeRef.current;
          if (!node) return;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          node.scaleX(1);
          node.scaleY(1);

          const x = node.x();
          const y = node.y();
          const newWidth = Math.max(5, node.width() * scaleX);
          const newHeight = Math.max(5, node.height() * scaleY);

          onChange({
            [FieldType.RECTANGLE]: [
              {
                frame,
                value: [x, y, x + newWidth, y + newHeight],
              },
            ],
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          onTransformStart={() => setIsTextVisible(false)}
          onTransformEnd={() => setIsTextVisible(true)}
          rotateEnabled={false}
          keepRatio={false}
          resizeEnabled={!isDone}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
}

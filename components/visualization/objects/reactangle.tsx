import Konva from "konva";
import React, { useEffect, useRef } from "react";
import { Rect, Transformer } from "react-konva";

import { getFieldValue } from "../../../utils/editors/functions";
import { FieldType } from "../../../utils/editors/types";
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
  const { frame, field, isSelected, onSelect, onChange } = props;
  const perFrame = field.fieldSchema.perFrame;
  const values = getFieldValue({
    values: field.values,
    perFrame,
    frame,
  })?.Rectangle;

  const shapeRef = useRef<Konva.Rect>(null);
  const trRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (!isSelected || !trRef.current || !shapeRef.current) return;
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
      <Rect
        ref={shapeRef}
        x={minX}
        y={minY}
        width={width}
        height={height}
        draggable
        stroke="red"
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={e => {
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
          rotateEnabled={false}
          keepRatio={false}
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

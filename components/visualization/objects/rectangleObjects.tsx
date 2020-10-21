import Konva from "konva";
import React, { useEffect, useRef } from "react";
import { Rect, Transformer, Text } from "react-konva";

import { getFieldValue } from "../../../utils/editors/functions";
import {
  FieldType,
  LabelingFieldAttributes,
  LabelingFieldValues,
} from "../../../utils/editors/types";
import {
  FontSize,
  SelectedStrokeWidth,
  UnselectedStrokeWidth,
} from "../../../utils/visualization/constanst";
import { RectangleBuilderStage } from "../../../utils/visualization/objects/rectangleBuilder";
import {
  FinishedObjectProps,
  InProgressObjectProps,
} from "../../../utils/visualization/types";

export interface RectProps {
  x: number;
  y: number;
  width: number;
  height: number;
  stroke?: string;
}

export function getRectProps(
  values?: LabelingFieldValues,
  attributes?: LabelingFieldAttributes,
): RectProps | null {
  const rectangle = values?.Rectangle;
  if (!rectangle) return null;
  const value = rectangle[0].value;
  if (!value) return null;
  const [x1, y1, x2, y2] = value;
  const [minX, maxX] = [x1, x2].sort((a, b) => a - b);
  const [minY, maxY] = [y1, y2].sort((a, b) => a - b);
  const stroke = attributes?.Rectangle?.color;
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY, stroke };
}

export function updateTextProps(
  text: React.RefObject<Konva.Text>,
  rect: RectProps,
): void {
  const node = text.current;
  node?.x(rect.x);
  node?.y(rect.y);
  node?.width(rect.width);
  node?.getLayer()?.batchDraw();
}

export function RectangleInProgress(
  props: InProgressObjectProps,
): JSX.Element | null {
  const { stage, value, fieldSchema } = props;
  if (stage <= RectangleBuilderStage.ONE_POINT) return null;
  const rectProps = getRectProps(value, fieldSchema.attributes);
  return rectProps && <Rect {...rectProps} />;
}

export function RectangleFinished(
  props: FinishedObjectProps,
): JSX.Element | null {
  const { frame, field, isSelected, object, onSelect, onChange } = props;
  const { isDone, name } = object;
  const { fieldSchema } = field;
  const { perFrame, attributes } = fieldSchema;
  const values = getFieldValue({
    values: field.values,
    perFrame,
    frame,
  });

  const textRef = useRef<Konva.Text>(null);
  const rectRef = useRef<Konva.Rect>(null);
  const trRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (!isSelected || !trRef.current || !rectRef.current) return;
    trRef.current.nodes([rectRef.current]);
    trRef.current.getLayer()?.batchDraw();
  }, [isSelected]);

  const rectProps = getRectProps(values, attributes);
  if (!rectProps) return null;

  const draggable = !isDone && isSelected;

  return (
    <>
      <Text
        ref={textRef}
        x={rectProps.x}
        y={rectProps.y}
        text={name}
        width={rectProps.width}
        align="center"
        fill={rectProps.stroke}
        fontSize={FontSize}
      />
      <Rect
        ref={rectRef}
        {...rectProps}
        draggable={draggable}
        strokeScaleEnabled={false}
        strokeWidth={isSelected ? SelectedStrokeWidth : UnselectedStrokeWidth}
        onClick={onSelect}
        onTap={onSelect}
        onDragMove={e =>
          updateTextProps(textRef, {
            x: e.target.x(),
            y: e.target.y(),
            width: e.target.width(),
            height: e.target.height(),
          })
        }
        onDragEnd={e => {
          const node = e.target;
          const x = node.x();
          const y = node.y();
          onChange({
            [FieldType.RECTANGLE]: [
              {
                frame,
                value: [x, y, x + node.width(), y + node.height()],
              },
            ],
          });
        }}
        onTransform={e =>
          updateTextProps(textRef, {
            x: e.target.x(),
            y: e.target.y(),
            width: e.target.width() * e.target.scaleX(),
            height: e.target.height() * e.target.scaleY(),
          })
        }
        onTransformEnd={() => {
          const node = rectRef.current;
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
          resizeEnabled={!isDone}
          boundBoxFunc={(oldBox, newBox) =>
            newBox.width < 5 || newBox.height < 5 ? oldBox : newBox
          }
        />
      )}
    </>
  );
}

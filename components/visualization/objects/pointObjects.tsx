import Konva from "konva";
import React, { useEffect, useRef } from "react";
import { Circle, Text } from "react-konva";

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
import { PointBuilderStage } from "../../../utils/visualization/objects/pointBuilder";
import {
  FinishedObjectProps,
  InProgressObjectProps,
} from "../../../utils/visualization/types";

export interface PointProps {
  x: number;
  y: number;
  radius: number;
  fill?: string;
  stroke?: string;
}

export function getPointProps(
  values?: LabelingFieldValues,
  attributes?: LabelingFieldAttributes,
): PointProps | null {
  const point = values?.Point;
  if (!point) return null;
  const points = point[0].value;
  if (!points) return null;
  const fill = attributes?.Point?.color;
  return { x: points[0], y: points[1], fill, stroke: "black", radius: 3 };
}

export function updateTextProps(
  text: React.RefObject<Konva.Text>,
  rect: PointProps,
): void {
  const node = text.current;
  node?.x(rect.x);
  node?.y(rect.y);
  node?.getLayer()?.batchDraw();
}

export function PointInProgress(
  props: InProgressObjectProps,
): JSX.Element | null {
  const { stage, value, fieldSchema } = props;
  if (stage <= PointBuilderStage.NO_POINTS) return null;
  const pointProps = getPointProps(value, fieldSchema.attributes);
  return pointProps && <Circle {...pointProps} />;
}

export function PointFinished(props: FinishedObjectProps): JSX.Element | null {
  const { frame, field, object, isSelected, onChange, onSelect } = props;
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

  const pointProps = getPointProps(values, attributes);
  const draggable = !isDone && isSelected;
  const strokeWidth = isSelected ? SelectedStrokeWidth : UnselectedStrokeWidth;

  return (
    pointProps && (
      <>
        <Text
          ref={textRef}
          x={pointProps.x}
          y={pointProps.y}
          text={name}
          align="center"
          fill={pointProps.fill}
          fontSize={FontSize}
          onClick={onSelect}
          onTap={onSelect}
        />
        <Circle
          {...pointProps}
          draggable={draggable}
          strokeScaleEnabled={false}
          strokeWidth={strokeWidth}
          onClick={onSelect}
          onTap={onSelect}
          onDragMove={e =>
            updateTextProps(textRef, {
              ...pointProps,
              x: e.target.x(),
              y: e.target.y(),
            })
          }
          onDragEnd={e => {
            const node = e.target;
            onChange({
              [FieldType.POINT]: [{ frame, value: [node.x(), node.y()] }],
            });
          }}
        />
      </>
    )
  );
}

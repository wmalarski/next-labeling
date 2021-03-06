import Konva from "konva";
import { KonvaEventObject } from "konva/types/Node";
import React, { useEffect, useRef } from "react";
import { Circle, Text } from "react-konva";
import { PointBuilderStage } from "../../editors/builders/pointBuilder";
import { getFieldValues } from "../../editors/functions";
import {
  FieldType,
  FinishedObjectProps,
  InProgressObjectProps,
  LabelingFieldAttributes,
  LabelingFieldValues,
} from "../../editors/types";
import { HoverTooltip } from "../../visualization/components/hoverTooltip";
import { FontSize } from "../constants";
import { getLabelText, getShapeStyle } from "../functions";

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
  const values = getFieldValues({
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

  const commonProps = {
    onClick: (event: KonvaEventObject<MouseEvent>): void =>
      onSelect(object.id, !event.evt.ctrlKey),
    onTap: () => onSelect(object.id, true),
  };

  return (
    pointProps && (
      <HoverTooltip text={getLabelText(object)}>
        <Text
          ref={textRef}
          {...commonProps}
          x={pointProps.x}
          y={pointProps.y}
          text={name}
          align="center"
          fill={pointProps.fill}
          fontSize={FontSize}
        />
        <Circle
          {...pointProps}
          {...getShapeStyle(isSelected)}
          {...commonProps}
          draggable={draggable}
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
      </HoverTooltip>
    )
  );
}

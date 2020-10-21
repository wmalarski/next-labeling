import Konva from "konva";
import React, { useRef } from "react";
import { Circle, Line } from "react-konva";
import range from "lodash/range";

import { getFieldValue } from "../../../utils/editors/functions";
import {
  FieldType,
  LabelingFieldAttributes,
  LabelingFieldValues,
} from "../../../utils/editors/types";
import {
  SelectedStrokeWidth,
  UnselectedStrokeWidth,
} from "../../../utils/visualization/constanst";
import { EyeBuilderStage } from "../../../utils/visualization/objects/eyeBuilder";
import {
  FinishedObjectProps,
  InProgressObjectProps,
} from "../../../utils/visualization/types";

export interface EyeShapeProps {
  points: number[];
  firstPoints: number[];
  secondPoints: number[];
  stroke?: string;
  tension?: number;
}

function splitPoints(
  points: number[],
): { firstPoints: number[]; secondPoints: number[] } {
  return {
    firstPoints: points.slice(0, 6),
    secondPoints: [...points.slice(4, 8), ...points.slice(0, 2)],
  };
}

export function getEyeShapeProps(
  values?: LabelingFieldValues,
  attributes?: LabelingFieldAttributes,
): EyeShapeProps | null {
  const eye = values?.Eye;
  if (!eye) return null;
  const points = eye[0].value;
  const stroke = attributes?.Eye?.color;
  const tension = 0.5;
  return {
    stroke,
    tension,
    points,
    ...splitPoints(points),
  };
}

function getNewEyeShape(
  firstLine: Konva.Line,
  secondLine: Konva.Line,
  index: number,
  event: Konva.KonvaEventObject<DragEvent>,
): EyeShapeProps {
  const points = [...firstLine.points(), ...secondLine.points().slice(2, 4)];
  const { x, y } = event.target.position();
  points.splice(index, 2, x, y);
  return { points, ...splitPoints(points) };
}

export function EyeInProgress(
  props: InProgressObjectProps,
): JSX.Element | null {
  const { stage, value, fieldSchema } = props;
  if (stage <= EyeBuilderStage.ONE_POINT) return null;
  const eyeProps = getEyeShapeProps(value, fieldSchema.attributes);
  return (
    eyeProps && (
      <>
        <Line
          points={eyeProps.firstPoints}
          stroke={eyeProps.stroke}
          tension={eyeProps.tension}
        />
        <Line
          points={eyeProps.secondPoints}
          stroke={eyeProps.stroke}
          tension={eyeProps.tension}
        />
      </>
    )
  );
}

export function EyeFinished(props: FinishedObjectProps): JSX.Element | null {
  const { frame, field, object, isSelected, onChange, onSelect } = props;
  const { isDone } = object;
  const { fieldSchema } = field;
  const { perFrame, attributes } = fieldSchema;
  const strokeWidth = isSelected ? SelectedStrokeWidth : UnselectedStrokeWidth;
  const draggable = !isDone && isSelected;

  const values = getFieldValue({
    values: field.values,
    perFrame,
    frame,
  });

  const firstLineRef = useRef<Konva.Line>(null);
  const secondLineRef = useRef<Konva.Line>(null);
  const pointsRef = useRef<(Konva.Circle | null)[]>([null, null, null, null]);

  const eyeProps = getEyeShapeProps(values, attributes);
  if (!eyeProps) return null;
  const { firstPoints, points, secondPoints, stroke, tension } = eyeProps;

  const lineCommonProps = {
    stroke,
    tension,
    draggable,
    strokeWidth,
    onClick: onSelect,
    onTap: onSelect,
  };

  return (
    <>
      <Line
        ref={firstLineRef}
        points={firstPoints}
        {...lineCommonProps}
        onDragMove={e => {
          const firstLine = firstLineRef.current;
          const secondLine = secondLineRef.current;
          if (!firstLine || !secondLine) return;
          const { x, y } = e.target.position();
          const newPoints = [
            ...firstLine.points(),
            ...secondPoints.slice(2, 4),
          ].map((v, i) => v + (i % 2 ? y : x));

          pointsRef.current.forEach((point, index) => {
            if (!point) return;
            point.x(newPoints[2 * index]);
            point.y(newPoints[2 * index + 1]);
          });
          const splited = splitPoints(newPoints);
          secondLine.points(splited.secondPoints);
          firstLine.getLayer()?.batchDraw();
        }}
        onDragEnd={e => {
          const firstLine = firstLineRef.current;
          if (!firstLine) return;
          const { x, y } = e.target.position();
          const newPoints = [
            ...firstLine.points(),
            ...secondPoints.slice(2, 4),
          ].map((v, i) => v + (i % 2 ? y : x));

          firstLine.position({ x: 0, y: 0 });
          onChange({
            [FieldType.EYE]: [{ frame, value: newPoints }],
          });
        }}
      />
      <Line
        ref={secondLineRef}
        points={secondPoints}
        {...lineCommonProps}
        onDragMove={e => {
          const firstLine = firstLineRef.current;
          const secondLine = secondLineRef.current;
          if (!firstLine || !secondLine) return;
          const { x, y } = e.target.position();

          const newPoints = [
            ...secondLine.points().slice(4, 6),
            ...firstPoints.slice(2, 4),
            ...secondLine.points().slice(0, 4),
          ].map((v, i) => v + (i % 2 ? y : x));

          pointsRef.current.forEach((point, index) => {
            if (!point) return;
            point.x(newPoints[2 * index]);
            point.y(newPoints[2 * index + 1]);
          });
          const splited = splitPoints(newPoints);
          firstLine.points(splited.firstPoints);
          secondLine.getLayer()?.batchDraw();
        }}
        onDragEnd={e => {
          const secondLine = secondLineRef.current;
          if (!secondLine) return;
          const { x, y } = e.target.position();
          const newPoints = [
            ...secondLine.points().slice(4, 6),
            ...firstPoints.slice(2, 4),
            ...secondLine.points().slice(0, 4),
          ].map((v, i) => v + (i % 2 ? y : x));

          secondLine.position({ x: 0, y: 0 });
          onChange({
            [FieldType.EYE]: [{ frame, value: newPoints }],
          });
        }}
      />
      {range(0, points.length, 2).map(index => (
        <Circle
          key={index}
          fill={stroke}
          ref={circle => {
            pointsRef.current[index / 2] = circle;
          }}
          x={points[index]}
          y={points[index + 1]}
          radius={strokeWidth + 1}
          strokeWidth={isSelected ? SelectedStrokeWidth : UnselectedStrokeWidth}
          onClick={onSelect}
          onTap={onSelect}
          draggable={draggable}
          onDragMove={e => {
            const firstLine = firstLineRef.current;
            const secondLine = secondLineRef.current;
            if (!firstLine || !secondLine) return;

            const newProps = getNewEyeShape(firstLine, secondLine, index, e);
            firstLine.points(newProps.firstPoints);
            secondLine.points(newProps.secondPoints);
            firstLine.getLayer()?.batchDraw();
          }}
          onDragEnd={e => {
            const firstLine = firstLineRef.current;
            const secondLine = secondLineRef.current;
            if (!firstLine || !secondLine) return;

            const newProps = getNewEyeShape(firstLine, secondLine, index, e);
            onChange({
              [FieldType.EYE]: [{ frame, value: newProps.points }],
            });
          }}
        />
      ))}
    </>
  );
}

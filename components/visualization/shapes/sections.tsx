import Konva from "konva";
import range from "lodash/range";
import React, { useRef } from "react";
import { Circle, Line } from "react-konva";
import { LabelingObject } from "../../../utils/labeling/types/client";

import {
  SelectedStrokeWidth,
  UnselectedStrokeWidth,
} from "../../../utils/visualization/constanst";

function getNewPoints(
  line: Konva.Line,
  index: number,
  event: Konva.KonvaEventObject<DragEvent>,
): number[] {
  const points = [...line.points()];
  const { x, y } = event.target.position();
  points.splice(index, 2, x, y);
  return points;
}

export interface SectionsShapeProps {
  points: number[];
  stroke?: string;
  opacity?: number;
  closed?: boolean;
}

export interface SectionsProps {
  isSelected: boolean;
  object: LabelingObject;
  sectionsProps: SectionsShapeProps;
  onSelect: () => void;
  onChange: (sectionsProps: SectionsShapeProps) => void;
}

export default function Sections(props: SectionsProps): JSX.Element | null {
  const { object, isSelected, sectionsProps, onChange, onSelect } = props;
  const { isDone } = object;
  const { points, stroke } = sectionsProps;
  const strokeWidth = isSelected ? SelectedStrokeWidth : UnselectedStrokeWidth;
  const draggable = !isDone && isSelected;

  const lineRef = useRef<Konva.Line>(null);
  const pointsRef = useRef<(Konva.Circle | null)[]>(
    range(points.length).map(() => null),
  );

  return (
    <>
      <Line
        ref={lineRef}
        {...sectionsProps}
        strokeWidth={strokeWidth}
        onClick={onSelect}
        onTap={onSelect}
        draggable={draggable}
        onDragMove={e => {
          const line = lineRef.current;
          if (!line) return;
          const newPoints = line.points();
          const { x, y } = e.target.position();
          pointsRef.current.forEach((point, index) => {
            if (!point) return;
            point.x(newPoints[2 * index] + x);
            point.y(newPoints[2 * index + 1] + y);
          });
          line.getLayer()?.batchDraw();
        }}
        onDragEnd={e => {
          const line = lineRef.current;
          if (!line) return;
          const { x, y } = e.target.position();
          const newPoints = line.points().map((v, i) => v + (i % 2 ? y : x));
          line.position({ x: 0, y: 0 });
          onChange({ ...sectionsProps, points: newPoints });
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
            const line = lineRef.current;
            if (!line) return;
            line.points(getNewPoints(line, index, e));
            line.getLayer()?.batchDraw();
          }}
          onDragEnd={e => {
            const line = lineRef.current;
            if (!line) return;
            onChange({
              ...sectionsProps,
              points: getNewPoints(line, index, e),
            });
          }}
        />
      ))}
    </>
  );
}

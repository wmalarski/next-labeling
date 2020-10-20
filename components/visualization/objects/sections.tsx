import Konva from "konva";
import range from "lodash/range";
import React, { useRef } from "react";
import { Circle, Line } from "react-konva";

import {
  SelectedStrokeWidth,
  UnselectedStrokeWidth,
} from "../../../utils/visualization/constanst";

function getNewPoints(
  line: Konva.Line,
  index: number,
  event: Konva.KonvaEventObject<DragEvent>,
): number[] {
  const newPoints = [...line.points()];
  const { x, y } = event.target.position();
  newPoints.splice(index, 2, x, y);
  return newPoints;
}

export interface SectionsProps {
  isDone: boolean;
  points: number[];
  stroke?: string;
  opacity?: number;
  closed?: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (points: number[]) => void;
}

export default function Sections(props: SectionsProps): JSX.Element | null {
  const {
    stroke,
    closed,
    opacity,
    isDone,
    points,
    isSelected,
    onChange,
    onSelect,
  } = props;

  const lineRef = useRef<Konva.Line>(null);
  const pointsRef = useRef<(Konva.Circle | null)[]>(
    range(points.length).map(() => null),
  );

  const strokeWidth = isSelected ? SelectedStrokeWidth : UnselectedStrokeWidth;
  const draggable = !isDone && isSelected;

  return (
    <>
      <Line
        ref={lineRef}
        stroke={stroke}
        opacity={opacity}
        closed={closed}
        points={points}
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
            point.x(newPoints[index] + x);
            point.y(newPoints[index + 1] + y);
          });
          line.getLayer()?.batchDraw();
        }}
        onDragEnd={e => {
          const line = lineRef.current;
          if (!line) return;
          const { x, y } = e.target.position();
          const newPoints = line.points().map((v, i) => v + (i % 2 ? y : x));
          line.position({ x: 0, y: 0 });
          onChange(newPoints);
        }}
      />
      {range(0, points.length, 2).map(index => (
        <Circle
          key={index}
          fill={stroke}
          ref={circle => {
            const newRefs = [...pointsRef.current];
            newRefs[index] = circle;
            pointsRef.current = newRefs;
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
            onChange(getNewPoints(line, index, e));
          }}
        />
      ))}
    </>
  );
}

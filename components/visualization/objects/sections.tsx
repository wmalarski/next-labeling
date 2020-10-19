import Konva from "konva";
import range from "lodash/range";
import React, { useRef } from "react";
import { Circle, Line } from "react-konva";

function getNewPoints(
  line: Konva.Line,
  index: number,
  event: Konva.KonvaEventObject<DragEvent>,
): number[] {
  const newPoints = [...line.points()];
  const newX = event.target.x();
  const newY = event.target.y();
  newPoints.splice(index, 2, newX, newY);
  return newPoints;
}

export interface SectionsProps {
  points: number[];
  onChange: (points: number[]) => void;
}

export default function Sections(props: SectionsProps): JSX.Element | null {
  const { points, onChange } = props;

  const lineRef = useRef<Konva.Line>(null);
  const pointsRef = useRef<(Konva.Circle | null)[]>(
    range(points.length).map(() => null),
  );

  return (
    <>
      <Line
        stroke="red"
        ref={lineRef}
        points={points}
        draggable
        onDragMove={e => {
          // e.target.x()
          const line = lineRef.current;
          if (!line) return;
          const newPoints = line.points();
          const x = e.target.x();
          const y = e.target.y();
          console.log(JSON.stringify({ newPoints, x, y }, null, 2));
          pointsRef.current.forEach((point, index) => {
            if (!point) return;
            point.x(points[index * 2] + x);
            point.y(points[index * 2 + 1] + y);
          });
          // line.getLayer()?.batchDraw();
        }}
      />
      {range(0, points.length, 2).map(index => (
        <Circle
          stroke="blue"
          key={index}
          ref={circle => {
            const newRefs = [...pointsRef.current];
            newRefs[index] = circle;
            pointsRef.current = newRefs;
          }}
          x={points[index]}
          y={points[index + 1]}
          radius={2}
          draggable
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

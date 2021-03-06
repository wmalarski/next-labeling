import Konva from "konva";
import { KonvaEventObject } from "konva/types/Node";
import range from "lodash/range";
import React, { useRef } from "react";
import { Circle, Line } from "react-konva";
import { getPoints2D } from "../../visualization/functions";
import { LabelingObject } from "../../workspace/types/client";
import { PointRadius } from "../constants";
import { getShapeStyle } from "../functions";

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
  onSelect: (id: string, reset: boolean) => void;
  onChange: (sectionsProps: SectionsShapeProps) => void;
}

export default function Sections(props: SectionsProps): JSX.Element | null {
  const { object, isSelected, sectionsProps, onChange, onSelect } = props;
  const { isDone } = object;
  const { points, stroke } = sectionsProps;
  const shapeStyle = getShapeStyle(isSelected);
  const draggable = !isDone && isSelected;

  const lineRef = useRef<Konva.Line>(null);
  const pointsRef = useRef<(Konva.Circle | null)[]>(
    range(points.length).map(() => null),
  );

  const commonProps = {
    onClick: (event: KonvaEventObject<MouseEvent>): void =>
      onSelect(object.id, !event.evt.ctrlKey),
    onTap: () => onSelect(object.id, true),
    draggable,
  };

  return (
    <>
      <Line
        ref={lineRef}
        {...sectionsProps}
        {...shapeStyle}
        {...commonProps}
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
      {getPoints2D(points).map(({ x, y }, index) => (
        <Circle
          key={index}
          {...shapeStyle}
          {...commonProps}
          fill={stroke}
          ref={circle => {
            pointsRef.current[index] = circle;
          }}
          x={x}
          y={y}
          radius={PointRadius}
          onDragMove={e => {
            const line = lineRef.current;
            if (!line) return;
            line.points(getNewPoints(line, 2 * index, e));
            line.getLayer()?.batchDraw();
          }}
          onDragEnd={e => {
            const line = lineRef.current;
            if (!line) return;
            onChange({
              ...sectionsProps,
              points: getNewPoints(line, 2 * index, e),
            });
          }}
        />
      ))}
    </>
  );
}

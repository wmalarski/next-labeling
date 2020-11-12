import Konva from "konva";
import { KonvaEventObject } from "konva/types/Node";
import React from "react";
import { Circle, Line } from "react-konva";
import { LabelingObject } from "../../../utils/labeling/types/client";
import { PointRadius } from "../../../utils/video/constants";
import { getShapeStyle } from "../../../utils/video/functions";

export interface BoxSideShapeProps {
  points: number[];
  stroke?: string;
}

export interface BoxSideProps {
  lineRef: React.RefObject<Konva.Line>;
  topRef: React.RefObject<Konva.Circle>;
  bottomRef: React.RefObject<Konva.Circle>;
  isSelected: boolean;
  object: LabelingObject;
  shapeProps: BoxSideShapeProps;
  onSelect: (id: string, reset: boolean) => void;
  onChange: (value: BoxSideShapeProps) => void;
  onMove?: (value: BoxSideShapeProps) => void;
}

function getPointsLaneDrag(
  e: KonvaEventObject<DragEvent>,
  points: number[],
): number[] {
  const { x, y } = e.target.position();
  return points.map((v, i) => v + (i % 2 ? y : x));
}

function getPointsTopDrag(
  e: KonvaEventObject<DragEvent>,
  points: number[],
): number[] {
  const { x, y } = e.target.position();
  const newPoints = [...points];
  newPoints.splice(2, 2, x, y);
  newPoints.splice(4, 1, x);
  return newPoints;
}

function getPointsBottomDrag(
  e: KonvaEventObject<DragEvent>,
  points: number[],
): number[] {
  const { x, y } = e.target.position();
  const newPoints = [...points];
  newPoints.splice(2, 1, x);
  newPoints.splice(4, 2, x, y);
  return newPoints;
}

export function BoxSide(props: BoxSideProps): JSX.Element | null {
  const {
    lineRef,
    topRef,
    bottomRef,
    shapeProps,
    isSelected,
    object,
    onSelect,
    onChange,
    onMove,
  } = props;
  const { isDone } = object;
  const draggable = !isDone && isSelected;
  const shapeStyle = getShapeStyle(isSelected);
  const { points } = shapeProps;
  const [x1, y1, x2, y2] = points.slice(2, 6);

  const commonProps = {
    ...shapeStyle,
    draggable,
    onClick: (event: KonvaEventObject<MouseEvent>): void =>
      onSelect(object.id, !event.evt.ctrlKey),
    onTap: () => onSelect(object.id, true),
  };

  // const lineRef = useRef<Konva.Line>(null);
  // const topRef = useRef<Konva.Circle>(null);
  // const bottomRef = useRef<Konva.Circle>(null);

  return (
    <>
      <Line
        ref={lineRef}
        {...shapeProps}
        {...commonProps}
        onDragMove={e =>
          onMove?.({ ...shapeProps, points: getPointsLaneDrag(e, points) })
        }
        onDragEnd={e =>
          onChange({ ...shapeProps, points: getPointsLaneDrag(e, points) })
        }
      />
      <Circle
        ref={topRef}
        {...commonProps}
        x={x1}
        y={y1}
        fill={shapeProps.stroke}
        stroke={shapeProps.stroke}
        radius={PointRadius}
        onDragMove={e => {
          const newPoints = getPointsTopDrag(e, points);
          lineRef.current?.points(newPoints);
          bottomRef.current?.position({ x: newPoints[4], y: newPoints[5] });
          onMove?.({ ...shapeProps, points: newPoints });
        }}
        onDragEnd={e =>
          onChange({ ...shapeProps, points: getPointsTopDrag(e, points) })
        }
      />
      <Circle
        ref={bottomRef}
        {...commonProps}
        x={x2}
        y={y2}
        fill={shapeProps.stroke}
        stroke={shapeProps.stroke}
        radius={PointRadius}
        onDragMove={e => {
          const newPoints = getPointsBottomDrag(e, points);
          lineRef.current?.points(newPoints);
          topRef.current?.position({ x: newPoints[2], y: newPoints[3] });
          onMove?.({ ...shapeProps, points: newPoints });
        }}
        onDragEnd={e =>
          onChange({ ...shapeProps, points: getPointsBottomDrag(e, points) })
        }
      />
    </>
  );
}

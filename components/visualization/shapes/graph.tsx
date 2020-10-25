import { fromArray } from "fp-ts/lib/ReadonlyNonEmptyArray";
import Konva from "konva";
import range from "lodash/range";
import React, { useMemo, useRef, useState } from "react";
import { Circle, Group, Line } from "react-konva";

import { LabelingObject } from "../../../utils/labeling/types/client";
import {
  SelectedStrokeWidth,
  UnselectedStrokeWidth,
} from "../../../utils/visualization/constanst";
import {
  getEventRelativePosition,
  getPointDistance,
} from "../../../utils/visualization/functions";

export interface GraphShapeNode {
  x: number;
  y: number;
  n: number;
}

export interface GraphShapeEdge {
  to: number;
  from: number;
}

export interface GraphShapeProps {
  points: GraphShapeNode[];
  edges: GraphShapeEdge[];
  stroke?: string;
}

export interface GraphProps {
  isSelected: boolean;
  object: LabelingObject;
  shapeProps: GraphShapeProps;
  onSelect: () => void;
  onChange: (shapeProps: GraphShapeProps) => void;
}

export default function Graph(props: GraphProps): JSX.Element | null {
  const { object, isSelected, shapeProps, onChange, onSelect } = props;
  const { points, edges, stroke } = shapeProps;
  const { isDone } = object;
  const strokeWidth = isSelected ? SelectedStrokeWidth : UnselectedStrokeWidth;
  const draggable = !isDone && isSelected;
  const radius = strokeWidth + 1;

  const edgesRef = useRef<(Konva.Line | null)[]>(
    range(edges.length).map(() => null),
  );
  const nodesRef = useRef<(Konva.Circle | null)[]>(
    range(points.length).map(() => null),
  );
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  const maxNode = useMemo(() => Math.max(...points.map(point => point.n)), [
    points,
  ]);
  const nnodes = Object.fromEntries(
    points.map(point => [point.n, { x: point.x, y: point.y }]),
  );

  return (
    <>
      {edges.map((edge, index) => {
        const from = nnodes[edge.from];
        const to = nnodes[edge.to];
        return (
          from &&
          to && (
            <Line
              key={index}
              ref={line => edgesRef.current.splice(index, 1, line)}
              points={[from.x, from.y, to.x, to.y]}
              stroke={stroke}
              strokeWidth={strokeWidth}
              onClick={onSelect}
              onTap={onSelect}
              draggable={draggable}
              onDragMove={e => {
                setHoveredNode(null);
                const { x, y } = e.target.position();
                nodesRef.current.forEach((nodeRef, ind) => {
                  if (!nodeRef) return;
                  const oldPoint = points[ind];
                  nodeRef.x(oldPoint.x + x);
                  nodeRef.y(oldPoint.y + y);
                });
                edgesRef.current.forEach((edgeRef, ind) => {
                  if (!edgeRef || index === ind) return;
                  const edgeInitial = edges[ind];
                  const { x: fromX, y: fromY } = nnodes[edgeInitial.from];
                  const { x: toX, y: toY } = nnodes[edgeInitial.to];
                  edgeRef.points([fromX + x, fromY + y, toX + x, toY + y]);
                });
                nodesRef.current.some(nodeRef =>
                  nodeRef?.getLayer()?.batchDraw(),
                );
              }}
              onDragEnd={e => {
                const edgeRef = edgesRef.current[index];
                if (!edgeRef) return;
                const { x, y } = e.target.position();
                edgeRef.position({ x: 0, y: 0 });
                onChange({
                  ...shapeProps,
                  points: points.map(point => ({
                    ...point,
                    x: point.x + x,
                    y: point.y + y,
                  })),
                });
              }}
              onDblClick={e => {
                if (!isSelected) return;
                const point = getEventRelativePosition(e);
                if (!point) return;
                const newNode = maxNode + 1;
                const newPoint = { x: point.x, y: point.y, n: newNode };
                onChange({
                  ...shapeProps,
                  points: [...points, newPoint],
                  edges: [
                    ...edges.filter((_edge, ind) => ind !== index),
                    { from: edge.from, to: newNode },
                    { from: newNode, to: edge.to },
                  ],
                });
              }}
            />
          )
        );
      })}
      {points.map(({ x, y, n }, index) => (
        <Group key={n}>
          <Circle
            x={x}
            y={y}
            radius={3 * radius}
            fill="white"
            opacity={n === hoveredNode ? 0.3 : 0}
            onMouseOver={() => {
              if (!isSelected) return;
              setHoveredNode(n);
            }}
            onMouseLeave={() => setHoveredNode(null)}
            onMouseOut={() => setHoveredNode(null)}
            onDblClick={e => {
              if (!isSelected) return;
              const point = getEventRelativePosition(e);
              if (!point) return;
              onChange({
                ...shapeProps,
                points: [
                  ...points,
                  { x: point.x + x, y: point.y + y, n: maxNode + 1 },
                ],
                edges: [...edges, { from: n, to: maxNode + 1 }],
              });
            }}
          />
          <Circle
            ref={circle => nodesRef.current.splice(index, 1, circle)}
            x={x}
            y={y}
            fill={stroke}
            radius={strokeWidth + 1}
            strokeWidth={strokeWidth}
            onClick={onSelect}
            onTap={onSelect}
            draggable={draggable}
            onDragMove={e => {
              setHoveredNode(null);
              const { x, y } = e.target.position();
              edges.forEach((edge, index) => {
                const edgeRef = edgesRef.current[index];
                if (!edgeRef) return;
                if (edge.from === n) {
                  const to = nnodes[edge.to];
                  edgeRef.points([x, y, to.x, to.y]);
                }
                if (edge.to === n) {
                  const from = nnodes[edge.from];
                  edgeRef.points([from.x, from.y, x, y]);
                }
              });
              nodesRef.current.some(node => node?.getLayer()?.batchDraw());
            }}
            onDragEnd={e => {
              const pos = e.target.position();
              const nearPoints = points
                .filter(point => getPointDistance(point, pos) < radius)
                .map(point => point.n);
              onChange({
                ...shapeProps,
                points: points
                  .map(point => (point.n === n ? { n, ...pos } : point))
                  .filter(point => !nearPoints.includes(point.n)),
                edges: edges
                  .map(edge => ({
                    from: nearPoints.includes(edge.from) ? n : edge.from,
                    to: nearPoints.includes(edge.to) ? n : edge.to,
                  }))
                  .filter(edge => edge.from !== edge.to),
              });
            }}
            onDblClick={() => {
              onChange({
                ...shapeProps,
                points: points.filter(point => point.n !== n),
                edges: edges.filter(edge => edge.from !== n && edge.to !== n),
              });
            }}
          />
        </Group>
      ))}
    </>
  );
}

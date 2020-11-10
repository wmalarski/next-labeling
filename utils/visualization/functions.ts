import { KonvaEventObject } from "konva/types/Node";
import range from "lodash/range";
import { Point2D } from "./types";

export function getEventRelativePosition(
  e: KonvaEventObject<MouseEvent>,
): Point2D | null {
  const stage = e.currentTarget.getStage();
  const transform = e.currentTarget.getAbsoluteTransform().copy();
  transform.invert();
  const pos = stage?.getPointerPosition();
  if (!pos) return null;
  return transform.point(pos);
}

export function getPoints2D(points: number[]): Point2D[] {
  return range(0, points.length, 2).map(i => ({
    x: points[i],
    y: points[i + 1],
  }));
}

export function getPointDistance(a: Point2D, b: Point2D): number {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

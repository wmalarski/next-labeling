import { KonvaEventObject } from "konva/types/Node";
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

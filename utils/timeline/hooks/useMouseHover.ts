import { KonvaEventObject } from "konva/types/Node";
import { Shape, ShapeConfig } from "konva/types/Shape";
import { useCallback } from "react";

export interface UseMouseHoverResult {
  onMouseEnter: (evt: KonvaEventObject<MouseEvent>) => void;
  onMouseLeave: (evt: KonvaEventObject<MouseEvent>) => void;
}

export default function useMouseHover<T extends ShapeConfig>(
  ref: React.RefObject<Shape<T>>,
  hover: T,
  out: T,
): UseMouseHoverResult {
  const onMouseEnter = useCallback(() => {
    ref.current?.setAttrs(hover);
    ref.current?.getLayer()?.batchDraw();
  }, [hover, ref]);

  const onMouseLeave = useCallback(() => {
    ref.current?.setAttrs(out);
    ref.current?.getLayer()?.batchDraw();
  }, [out, ref]);

  return {
    onMouseEnter,
    onMouseLeave,
  };
}

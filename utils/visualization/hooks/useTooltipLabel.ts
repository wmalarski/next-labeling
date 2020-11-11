import Konva from "konva";
import { KonvaEventObject } from "konva/types/Node";
import { RefObject, useCallback, useRef } from "react";
import { getEventRelativePosition } from "../functions";
import { Point2D } from "../types";

export interface UseTooltipLabelRefs {
  labelRef: RefObject<Konva.Label>;
  textRef: RefObject<Konva.Text>;
}

export interface UseTooltipLabelResult {
  refs: UseTooltipLabelRefs;
  onPointMove: (point: Point2D, text?: string) => void;
  onMouseMove: (evt: KonvaEventObject<MouseEvent>, text?: string) => void;
  onMouseLeave: () => void;
}

export function useTooltipLabel(): UseTooltipLabelResult {
  const labelRef = useRef<Konva.Label>(null);
  const textRef = useRef<Konva.Text>(null);

  const onPointMove = useCallback((point: Point2D, newText?: string): void => {
    const label = labelRef.current;
    const text = textRef.current;
    if (!label || !text) return;

    label.position(point);
    if (newText) text.text(newText);
    label.show();
    label.getLayer()?.batchDraw();
  }, []);

  const onMouseMove = useCallback(
    (event: KonvaEventObject<MouseEvent>, newText?: string): void => {
      const mousePos = getEventRelativePosition(event);
      if (mousePos) onPointMove(mousePos, newText);
    },
    [onPointMove],
  );
  const onMouseLeave = useCallback(() => {
    labelRef.current?.hide();
    labelRef.current?.getLayer()?.draw();
  }, []);

  return {
    refs: {
      labelRef,
      textRef,
    },
    onPointMove,
    onMouseMove,
    onMouseLeave,
  };
}

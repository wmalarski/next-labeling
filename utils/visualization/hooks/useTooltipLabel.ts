import Konva from "konva";
import { KonvaEventObject } from "konva/types/Node";
import { RefObject, useCallback, useRef } from "react";
import { getEventRelativePosition } from "../functions";

export interface UseTooltipLabelResult {
  labelRef: RefObject<Konva.Label>;
  textRef: RefObject<Konva.Text>;
  onMouseMove: (evt: KonvaEventObject<MouseEvent>, text?: string) => void;
  onMouseOut: (evt: KonvaEventObject<MouseEvent>) => void;
  onMouseLeave: (evt: KonvaEventObject<MouseEvent>) => void;
}

export function useTooltipLabel(): UseTooltipLabelResult {
  const labelRef = useRef<Konva.Label>(null);
  const textRef = useRef<Konva.Text>(null);

  const onMouseMove = useCallback(
    (event: KonvaEventObject<MouseEvent>, newText?: string): void => {
      const label = labelRef.current;
      const text = textRef.current;
      const mousePos = getEventRelativePosition(event);
      if (!label || !mousePos || !text) return;

      label.position(mousePos);
      if (newText) text.text(newText);
      label.show();
      label.getLayer()?.batchDraw();
    },
    [],
  );
  const onMouseOut = useCallback(() => {
    labelRef.current?.hide();
    labelRef.current?.getLayer()?.draw();
  }, []);

  return {
    labelRef,
    textRef,
    onMouseMove,
    onMouseOut,
    onMouseLeave: onMouseOut,
  };
}

import React, { useCallback, useState } from "react";

interface Point2D {
  x: number;
  y: number;
}

export interface UseZoomAndPaneState {
  dragStart?: Point2D;
  scale: Point2D;
  position: Point2D;
}

type MouseEventHandler = (
  event: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
) => void;

export interface UseZoomAndPaneResult {
  scale: Point2D;
  position: Point2D;
  callbacks: {
    onWheel: (event: React.WheelEvent<HTMLCanvasElement>) => void;
    onMouseDown: MouseEventHandler;
    onMouseMove: MouseEventHandler;
    onMouseLeave: MouseEventHandler;
    onMouseOut: MouseEventHandler;
    onMouseUp: MouseEventHandler;
  };
}

export default function useZoomAndPane(enabled: boolean): UseZoomAndPaneResult {
  const [state, setState] = useState<UseZoomAndPaneState>({
    scale: { x: 1, y: 1 },
    position: { x: 1, y: 1 },
  });

  const onWheel = useCallback(
    (event): void => {
      if (!enabled) return;
      const localX = event.clientX - event.currentTarget.offsetLeft;
      const localY = event.clientY - event.currentTarget.offsetTop;
      const direction = event.deltaY < 0 ? 1 : -1;
      const factor = 1 + direction * 0.1;

      setState(state => ({
        ...state,
        scale: {
          x: state.scale.x * factor,
          y: state.scale.y * factor,
        },
        position: {
          x: (state.position.x - localX) * factor + localX,
          y: (state.position.y - localY) * factor + localY,
        },
      }));
    },
    [enabled],
  );
  const onMouseDown = useCallback(
    (event): void => {
      if (!enabled) return;
      setState(state => ({
        ...state,
        dragStart: { x: event.clientX, y: event.clientY },
      }));
    },
    [enabled],
  );
  const onMouseMove = useCallback(
    (event): void => {
      if (!enabled) return;
      const clientX = event.clientX;
      const clientY = event.clientY;
      setState(state => {
        if (!state.dragStart) return state;
        const dx = clientX - state.dragStart.x;
        const dy = clientY - state.dragStart.y;
        return {
          ...state,
          position: {
            x: state.position.x + dx,
            y: state.position.y + dy,
          },
          dragStart: {
            x: clientX,
            y: clientY,
          },
        };
      });
    },
    [enabled],
  );
  const onMouseUp = useCallback((): void => {
    if (!enabled) return;
    setState(state => ({
      ...state,
      dragStart: undefined,
    }));
  }, [enabled]);

  return {
    position: state.position,
    scale: state.scale,
    callbacks: {
      onWheel,
      onMouseDown,
      onMouseMove,
      onMouseUp,
      onMouseLeave: onMouseUp,
      onMouseOut: onMouseUp,
    },
  };
}

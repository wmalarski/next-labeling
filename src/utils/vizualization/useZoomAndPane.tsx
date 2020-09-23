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
  onReset: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
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
    position: { x: 0, y: 0 },
  });

  const onWheel = useCallback((event): void => {
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
  }, []);
  const onReset = useCallback(
    (): void =>
      setState({
        scale: { x: 1, y: 1 },
        position: { x: 1, y: 1 },
      }),
    [],
  );
  const onZoomIn = useCallback(
    (): void =>
      setState(state => ({
        ...state,
        scale: {
          x: state.scale.x * 1.1,
          y: state.scale.y * 1.1,
        },
      })),
    [],
  );
  const onZoomOut = useCallback(
    (): void =>
      setState(state => ({
        ...state,
        scale: {
          x: state.scale.x * 0.9,
          y: state.scale.y * 0.9,
        },
      })),
    [],
  );
  const onMouseDown = useCallback(
    (event): void => {
      if (!enabled) return;
      const clientX = event.clientX;
      const clientY = event.clientY;
      setState(state => ({
        ...state,
        dragStart: { x: clientX, y: clientY },
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
    onReset,
    onZoomIn,
    onZoomOut,
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

import { useCallback, useEffect, useState } from "react";
import { Point2D } from "../../visualization/types";
import { CoordsFieldBuilder } from "../builders/getCoordsBuilder";
import { CoordsBuilderResult } from "../types";

export interface UseCoordsBuilderState {
  lastValue?: CoordsBuilderResult;
  currentValue?: CoordsBuilderResult;
  isDrawing: boolean;
  isEnded: boolean;
}

export interface UseCoordsBuilderResult {
  builderState: UseCoordsBuilderState;
  pushPoint: (point: Point2D, frame: number) => void;
  acceptPoint: (point: Point2D, finish: boolean, frame: number) => void;
  resetEdit: () => void;
}

export default function useCoordsBuilder(
  fieldBuilder?: CoordsFieldBuilder,
): UseCoordsBuilderResult {
  const [builderState, setBuilderState] = useState<UseCoordsBuilderState>({
    isDrawing: !!fieldBuilder,
    isEnded: false,
  });

  useEffect(() => {
    if (!fieldBuilder) return;
    setBuilderState({ isDrawing: true, isEnded: false });
  }, [fieldBuilder]);

  const pushPoint = useCallback(
    (point: Point2D, frame: number): void =>
      setBuilderState(state => {
        if (!state.isDrawing || !fieldBuilder) return state;
        const builderResult = fieldBuilder.builder(
          point,
          frame,
          state.lastValue?.value,
        );
        return {
          ...state,
          currentValue: builderResult,
        };
      }),
    [fieldBuilder],
  );

  const acceptPoint = useCallback(
    (point: Point2D, finish: boolean, frame: number): void =>
      setBuilderState(state => {
        if (!state.isDrawing || !fieldBuilder) return state;
        const builderResult = fieldBuilder.builder(
          point,
          frame,
          state.lastValue?.value,
        );
        const isDrawing = !finish && !builderResult?.isFinished;
        return finish && !builderResult?.canBeFinished
          ? { isDrawing: false, isEnded: true }
          : {
              isDrawing,
              isEnded: !isDrawing,
              lastValue: builderResult,
            };
      }),
    [fieldBuilder],
  );

  const resetEdit = useCallback(
    (): void => setBuilderState({ isDrawing: false, isEnded: false }),
    [],
  );

  return {
    builderState,
    pushPoint,
    acceptPoint,
    resetEdit,
  };
}

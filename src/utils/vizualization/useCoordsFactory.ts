import * as PIXI from "pixi.js";
import { useCallback, useEffect, useState } from "react";

import { CoordsBuilderResult, CoordsFieldBuilder } from "./coordsBuilders";

export interface UseCoordsFactoryState {
  lastValue?: CoordsBuilderResult;
  currentValue?: CoordsBuilderResult;
  isDrawing: boolean;
  isEnded: boolean;
}

export interface UseCoordsFactoryResult {
  factoryState: UseCoordsFactoryState;
  pushPoint: (point: PIXI.Point) => void;
  acceptPoint: (point: PIXI.Point, finish: boolean) => void;
  resetEdit: () => void;
}

export default function useCoordsFactory(
  fieldBuilder?: CoordsFieldBuilder,
): UseCoordsFactoryResult {
  const [factoryState, setFactoryState] = useState<UseCoordsFactoryState>({
    isDrawing: !!fieldBuilder,
    isEnded: false,
  });

  useEffect(() => {
    if (!fieldBuilder) return;
    setFactoryState({ isDrawing: true, isEnded: false });
  }, [fieldBuilder]);

  const pushPoint = useCallback(
    (point: PIXI.Point): void =>
      setFactoryState(state => {
        if (!state.isDrawing || !fieldBuilder) return state;
        const builderResult = fieldBuilder.builder(
          point,
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
    (point: PIXI.Point, finish: boolean): void =>
      setFactoryState(state => {
        if (!state.isDrawing || !fieldBuilder) return state;
        const builderResult = fieldBuilder.builder(
          point,
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
    (): void => setFactoryState({ isDrawing: false, isEnded: false }),
    [],
  );

  return {
    factoryState,
    pushPoint,
    acceptPoint,
    resetEdit,
  };
}

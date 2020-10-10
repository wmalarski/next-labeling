import * as PIXI from "pixi.js";
import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { LabelingFieldValue } from "../editors/types";

import { FieldSchema } from "../schema/types";
import { CoordsBuilderResult, CoordsFieldBuilder } from "./coordsBuilders";
import { MouseButton } from "./types";

export interface UseCoordsFactoryState {
  lastValue?: CoordsBuilderResult;
  currentValue?: CoordsBuilderResult;
  isDrawing: boolean;
}

export interface UseCoordsFactoryResult {
  factoryState: UseCoordsFactoryState;
  fieldSchema?: FieldSchema;
  pushPoint: (point: PIXI.Point) => void;
  acceptPoint: (point: PIXI.Point, finish: boolean) => void;
  resetEdit: () => void;
}

export default function useCoordsFactory(
  fieldBuilder?: CoordsFieldBuilder,
): UseCoordsFactoryResult {
  const [factoryState, setFactoryState] = useState<UseCoordsFactoryState>({
    isDrawing: !!fieldBuilder,
  });

  useEffect(() => {
    if (!fieldBuilder) return;
    setFactoryState({ isDrawing: true });
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
        return finish && !builderResult?.canBeFinished
          ? { isDrawing: false }
          : {
              isDrawing: !finish && !builderResult?.isFinished,
              lastValue: builderResult,
            };
      }),
    [fieldBuilder],
  );

  // const removePoint = useCallback((): void => {
  //   const oldState = coords.current;
  //   const newHistory = [...oldState.history];
  //   const temporary = newHistory.pop();
  //   coords.current = {
  //     history: newHistory,
  //     temporary,
  //   };
  // }, []);

  const resetEdit = useCallback(
    (): void => setFactoryState({ isDrawing: false }),
    [],
  );

  return {
    factoryState,
    pushPoint,
    acceptPoint,
    resetEdit,
  };
}

import * as PIXI from "pixi.js";
import { useCallback, useState } from "react";

import { LabelingFieldValue } from "../editors/types";
import { CoordsBuilderResult, CoordsFieldBuilder } from "./coordsBuilders";

export interface UseCoordsBuilderState {
  history: CoordsBuilderResult[];
  temporary?: CoordsBuilderResult;
  isFinished: boolean;
}

export interface UseCoordsBuilderResult {
  stage: number;
  isFinished: boolean;
  canBeFinished: boolean;
  value?: LabelingFieldValue;
  pushPoint: (point: PIXI.Point) => void;
  acceptPoint: (isFinished: boolean) => void;
  removePoint: () => void;
  resetEdit: () => void;
}

export default function useCoordsBuilder(
  fieldBuilder?: CoordsFieldBuilder,
): UseCoordsBuilderResult {
  const [{ history, isFinished }, setState] = useState<UseCoordsBuilderState>({
    isFinished: false,
    history: [
      {
        stage: 0,
        canBeFinished: false,
      },
    ],
  });

  const pushPoint = useCallback(
    (point: PIXI.Point): void => {
      if (!fieldBuilder) return;
      setState(oldState => {
        const last = oldState.history[oldState.history.length - 1];
        const result = fieldBuilder.builder(point, last.value);
        if (!result) return oldState;
        return { ...oldState, temporary: result };
      });
    },
    [fieldBuilder],
  );

  const acceptPoint = useCallback(
    (isFinished: boolean): void => {
      if (!fieldBuilder) return;
      setState(oldState => {
        if (!oldState.temporary) return oldState;
        return {
          history: [...oldState.history, oldState.temporary],
          isFinished,
        };
      });
    },
    [fieldBuilder],
  );

  const removePoint = useCallback(
    (): void =>
      setState(oldState => {
        const newHistory = [...oldState.history];
        const temporary = newHistory.pop();
        return {
          isFinished: false,
          temporary,
          history: newHistory,
        };
      }),
    [],
  );

  const resetEdit = useCallback(
    (): void => setState({ history: [], isFinished: false }),
    [],
  );

  return {
    isFinished,
    ...history[history.length - 1],
    pushPoint,
    acceptPoint,
    removePoint,
    resetEdit,
  };
}

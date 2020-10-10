import * as PIXI from "pixi.js";
import { useCallback, useEffect, useState } from "react";

import { LabelingFieldValue } from "../editors/types";
import { FieldSchema } from "../schema/types";
import { CoordsBuilderResult, CoordsFieldBuilder } from "./coordsBuilders";

export interface UseCoordsBuilderState {
  history: CoordsBuilderResult[];
  temporary?: CoordsBuilderResult;
}

export interface UseCoordsBuilderResult {
  stage: number;
  isFinished: boolean;
  canBeFinished: boolean;
  value?: LabelingFieldValue;
  fieldSchema?: FieldSchema;
  pushPoint: (point: PIXI.Point) => void;
  acceptPoint: (isFinished: boolean) => void;
  removePoint: () => void;
  resetEdit: () => void;
}

const defaultState: UseCoordsBuilderState = {
  history: [
    {
      stage: 0,
      isFinished: false,
      canBeFinished: false,
    },
  ],
};

export default function useCoordsBuilder(
  fieldBuilder?: CoordsFieldBuilder,
): UseCoordsBuilderResult {
  const [{ history }, setState] = useState<UseCoordsBuilderState>(defaultState);

  useEffect(() => setState(defaultState), [fieldBuilder]);

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

  const resetEdit = useCallback((): void => setState({ history: [] }), []);

  return {
    ...history[history.length - 1],
    fieldSchema: fieldBuilder?.field.fieldSchema,
    pushPoint,
    acceptPoint,
    removePoint,
    resetEdit,
  };
}

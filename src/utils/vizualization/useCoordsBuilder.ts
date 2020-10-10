import * as PIXI from "pixi.js";
import { MutableRefObject, useCallback, useEffect, useRef } from "react";

import { FieldSchema } from "../schema/types";
import { CoordsBuilderResult, CoordsFieldBuilder } from "./coordsBuilders";
import { MouseButton } from "./types";

export interface CoordsRefState {
  history: CoordsBuilderResult[];
  temporary?: CoordsBuilderResult;
}

const initCoordsRefState = {
  history: [
    {
      stage: 0,
      isFinished: false,
      canBeFinished: false,
    },
  ],
};

export interface UseCoordsBuilderResult {
  coords: MutableRefObject<CoordsRefState>;
  fieldSchema?: FieldSchema;
  pushPoint: (point: PIXI.Point) => void;
  acceptPoint: (forceFinish: boolean) => void;
  removePoint: () => void;
  resetEdit: () => void;
}

export default function useCoordsBuilder(
  fieldBuilder?: CoordsFieldBuilder,
): UseCoordsBuilderResult {
  const coords = useRef<CoordsRefState>(initCoordsRefState);
  useEffect(() => {
    coords.current = initCoordsRefState;
  }, [fieldBuilder]);

  const pushPoint = useCallback(
    (point: PIXI.Point): void => {
      if (!fieldBuilder) return;
      const oldState = coords.current;
      const last = oldState.history[oldState.history.length - 1];
      const result = fieldBuilder.builder(point, last.value);
      if (!result) return;
      coords.current = { ...oldState, temporary: result };
    },
    [fieldBuilder],
  );

  const acceptPoint = useCallback(
    (forceFinish: boolean): void => {
      if (!fieldBuilder) return;
      const oldState = coords.current;
      if (!oldState.temporary) return;

      const isFinished =
        oldState.temporary.isFinished ||
        (oldState.temporary.canBeFinished && forceFinish);

      coords.current = {
        history: [
          ...oldState.history,
          {
            ...oldState.temporary,
            isFinished,
          },
        ],
      };
    },
    [fieldBuilder],
  );

  const removePoint = useCallback((): void => {
    const oldState = coords.current;
    const newHistory = [...oldState.history];
    const temporary = newHistory.pop();
    coords.current = {
      history: newHistory,
      temporary,
    };
  }, []);

  const resetEdit = useCallback((): void => {
    coords.current = initCoordsRefState;
  }, []);

  return {
    coords,
    fieldSchema: fieldBuilder?.field.fieldSchema,
    pushPoint,
    acceptPoint,
    removePoint,
    resetEdit,
  };
}

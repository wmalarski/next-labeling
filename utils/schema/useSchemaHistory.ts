import { useCallback, useRef, useState } from "react";

import { defaultLabelingSchema } from "./defaults";
import { Schema } from "./types";

export interface SchemaState {
  schema: Schema;
  message: string;
}

export interface SchemaHistoryState {
  history: SchemaState[];
  index: number;
}

export interface UseSchemaHistoryResult {
  schema: Schema;
  message: string;
  setSchema: (provider: (schema: Schema) => SchemaState | undefined) => void;
  undoSchema: () => void;
  redoSchema: () => void;
  resetHistory: (schema: Schema) => void;
  undoMessage?: string;
  redoMessage?: string;
}

export default function useSchemaHistory(
  initial?: Schema,
  maxSize?: number,
): UseSchemaHistoryResult {
  const bufferSize = useRef(maxSize ?? 20);
  const [state, setState] = useState<SchemaHistoryState>({
    history: [
      { schema: initial ?? defaultLabelingSchema, message: "Schema loaded" },
    ],
    index: 0,
  });

  const undoSchema = useCallback(
    (): void =>
      setState(value => ({ ...value, index: Math.max(value.index - 1, 0) })),
    [setState],
  );
  const redoSchema = useCallback(
    (): void =>
      setState(value => ({
        ...value,
        index: Math.min(value.index + 1, value.history.length - 1),
      })),
    [setState],
  );
  const setSchema = useCallback(
    (provider: (schema: Schema) => SchemaState | undefined): void =>
      setState(value => {
        const currentSchema = value.history[value.index].schema;
        const result = provider(currentSchema);
        if (!result) return value;

        const { schema, message } = result;
        const newHistory = [...value.history];
        newHistory.splice(value.index + 1);

        if (newHistory.length < bufferSize.current) {
          return {
            history: [...newHistory, { schema, message }],
            index: value.index + 1,
          };
        }
        newHistory.shift();
        return {
          history: [...newHistory, { schema, message }],
          index: value.index,
        };
      }),
    [setState],
  );

  const resetHistory = useCallback(
    (schema: Schema): void =>
      setState({
        history: [{ schema, message: "Initial schema" }],
        index: 0,
      }),
    [setState],
  );

  return {
    ...state.history[state.index],
    undoSchema,
    redoSchema,
    setSchema,
    resetHistory,
    undoMessage: state.history[state.index - 1]?.message,
    redoMessage: state.history[state.index + 1]?.message,
  };
}

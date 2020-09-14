import { useCallback, useRef, useState } from "react";
import { defaultLabelingSchema } from "./defaults";
import { LabelingSchema } from "./types";

export interface SchemaState {
  schema: LabelingSchema;
  message: string;
}

export type NullableSchemaState = SchemaState | undefined;

export interface SchemaHistoryState {
  history: SchemaState[];
  index: number;
}

export interface UseSchemaHistoryResult {
  schema: LabelingSchema;
  message: string;
  setSchema: (setter: (schema: LabelingSchema) => NullableSchemaState) => void;
  undoSchema: () => void;
  redoSchema: () => void;
  undoMessage?: string;
  redoMessage?: string;
}

export default function useSchemaHistory(
  initial?: LabelingSchema,
  maxSize?: number
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
      setState((value) => ({ ...value, index: Math.max(value.index - 1, 0) })),
    [setState]
  );
  const redoSchema = useCallback(
    (): void =>
      setState((value) => ({
        ...value,
        index: Math.min(value.index + 1, value.history.length - 1),
      })),
    [setState]
  );
  const setSchema = useCallback(
    (setter: (schema: LabelingSchema) => NullableSchemaState): void =>
      setState((value) => {
        const currentSchema = value.history[value.index].schema;
        const result = setter(currentSchema);
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
    [setState]
  );

  return {
    ...state.history[state.index],
    undoSchema,
    redoSchema,
    setSchema,
    undoMessage: state.history[state.index - 1]?.message,
    redoMessage: state.history[state.index + 1]?.message,
  };
}

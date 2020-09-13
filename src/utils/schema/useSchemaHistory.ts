import { useRef, useState } from "react";
import { defaultLabelingSchema } from "./defaults";
import { LabelingSchema } from "./types";

export interface SchemaState {
  schema: LabelingSchema;
  message: string;
}

export interface UseSchemaHistoryResult {
  schema: LabelingSchema;
  message: string;
  push: (schema: LabelingSchema, message: string) => void;
  undo: () => void;
  redo: () => void;
  undoMessage?: string;
  redoMessage?: string;
}

export default function useSchemaHistory(
  initial?: LabelingSchema,
  maxSize?: number
): UseSchemaHistoryResult {
  const bufferSize = useRef(maxSize ?? 20);
  const [schemaHistory, setSchemaHistory] = useState<SchemaState[]>([
    { schema: initial ?? defaultLabelingSchema, message: "Schema loaded" },
  ]);
  const [index, setIndex] = useState(0);

  return {
    ...schemaHistory[index],
    push: (schema, message) => {
      const newHistory = [...schemaHistory];
      newHistory.splice(index + 1);
      if (newHistory.length < bufferSize.current) {
        setIndex(index + 1);
      } else {
        newHistory.shift();
      }
      setSchemaHistory([...newHistory, { schema, message }]);
    },
    undo: () => setIndex(Math.max(index - 1, 0)),
    redo: () => setIndex(Math.min(index + 1, schemaHistory.length - 1)),
    undoMessage: schemaHistory[index - 1]?.message,
    redoMessage: schemaHistory[index + 1]?.message,
  };
}

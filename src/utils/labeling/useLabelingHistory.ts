import { useCallback, useRef, useState } from "react";
import { LabelingDocument } from "./types";

export interface LabelingState {
  document: LabelingDocument;
  message: string;
}

export interface UseLabelingHistoryState {
  history: LabelingState[];
  index: number;
}

export interface UseLabelingHistoryResult {
  document: LabelingDocument;
  message: string;
  setLabeling: (
    provider: (document: LabelingDocument) => LabelingState | undefined,
  ) => void;
  undoLabeling: () => void;
  redoLabeling: () => void;
  undoMessage?: string;
  redoMessage?: string;
}

export default function useLabelingHistory(
  initial: LabelingDocument,
  maxSize?: number,
): UseLabelingHistoryResult {
  const bufferSize = useRef(maxSize ?? 20);
  const [state, setState] = useState<UseLabelingHistoryState>({
    history: [{ document: initial, message: "Labeling loaded" }],
    index: 0,
  });

  const undoLabeling = useCallback(
    (): void =>
      setState(value => ({ ...value, index: Math.max(value.index - 1, 0) })),
    [setState],
  );
  const redoLabeling = useCallback(
    (): void =>
      setState(value => ({
        ...value,
        index: Math.min(value.index + 1, value.history.length - 1),
      })),
    [setState],
  );
  const setLabeling = useCallback(
    (provider: (doc: LabelingDocument) => LabelingState | undefined): void =>
      setState(value => {
        const currentLabeling = value.history[value.index].document;
        const result = provider(currentLabeling);
        if (!result) return value;

        const { document, message } = result;
        const newHistory = [...value.history];
        newHistory.splice(value.index + 1);

        if (newHistory.length < bufferSize.current) {
          return {
            history: [...newHistory, { document, message }],
            index: value.index + 1,
          };
        }
        newHistory.shift();
        return {
          history: [...newHistory, { document, message }],
          index: value.index,
        };
      }),
    [setState],
  );

  return {
    ...state.history[state.index],
    undoLabeling,
    redoLabeling,
    setLabeling,
    undoMessage: state.history[state.index - 1]?.message,
    redoMessage: state.history[state.index + 1]?.message,
  };
}

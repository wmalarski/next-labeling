import { useCallback, useRef, useState } from "react";
import { LabelingData } from "./types";

export interface LabelingState {
  data: LabelingData;
  message: string;
}

export interface UseLabelingHistoryState {
  history: LabelingState[];
  index: number;
}

export interface UseLabelingHistoryResult {
  data: LabelingData;
  message: string;
  setLabeling: (
    provider: (data: LabelingData) => LabelingState | undefined,
  ) => void;
  undoLabeling: () => void;
  redoLabeling: () => void;
  undoMessage?: string;
  redoMessage?: string;
}

export default function useLabelingHistory(
  initial: LabelingData,
  maxSize?: number,
): UseLabelingHistoryResult {
  const bufferSize = useRef(maxSize ?? 20);
  const [state, setState] = useState<UseLabelingHistoryState>({
    history: [{ data: initial, message: "Labeling loaded" }],
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
    (provider: (data: LabelingData) => LabelingState | undefined): void =>
      setState(value => {
        const currentLabeling = value.history[value.index].data;
        const result = provider(currentLabeling);
        if (!result) return value;

        const { data, message } = result;
        const newHistory = [...value.history];
        newHistory.splice(value.index + 1);

        if (newHistory.length < bufferSize.current) {
          return {
            history: [...newHistory, { data, message }],
            index: value.index + 1,
          };
        }
        newHistory.shift();
        return {
          history: [...newHistory, { data, message }],
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

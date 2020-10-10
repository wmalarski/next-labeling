import { useCallback, useMemo, useRef, useState } from "react";
import { createExtendedLabeling } from "./functions";
import { ExtendedLabeling, LabelingDocument } from "./types";

export interface LabelingState {
  data: ExtendedLabeling;
  message: string;
}

export interface UseLabelingHistoryState {
  history: LabelingState[];
  index: number;
}

export interface UseLabelingHistoryResult {
  data: ExtendedLabeling;
  message: string;
  pushLabeling: (
    provider: (data: ExtendedLabeling) => LabelingState | undefined,
  ) => void;
  undoLabeling: () => void;
  redoLabeling: () => void;
  setIndex: (index: number) => void;
  index: number;
  undoMessage?: string;
  redoMessage?: string;
  messages: string[];
}

export default function useLabelingHistory(
  document: LabelingDocument,
  maxSize?: number,
): UseLabelingHistoryResult {
  const bufferSize = useRef(maxSize ?? 20);
  const [state, setState] = useState<UseLabelingHistoryState>({
    history: [
      {
        data: createExtendedLabeling(document),
        message: "Labeling loaded",
      },
    ],
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
  const pushLabeling = useCallback(
    (provider: (data: ExtendedLabeling) => LabelingState | undefined): void =>
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
  const setIndex = useCallback(
    (index: number): void =>
      setState(value => ({
        ...value,
        index: Math.min(Math.max(index - 1, 0), value.history.length - 1),
      })),
    [],
  );
  const messages = useMemo(() => state.history.map(pair => pair.message), [
    state.history,
  ]);

  return {
    ...state.history[state.index],
    setIndex,
    undoLabeling,
    redoLabeling,
    pushLabeling,
    messages,
    index: state.index,
    undoMessage: state.history[state.index - 1]?.message,
    redoMessage: state.history[state.index + 1]?.message,
  };
}

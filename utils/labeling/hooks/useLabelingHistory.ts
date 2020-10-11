import { v4 as uuidv4 } from "uuid";

import { useCallback, useMemo, useRef, useState } from "react";
import { createLabelingDocument } from "../functions";
import { LabelingDocument } from "../types/client";
import { OverridableComponent } from "@material-ui/core/OverridableComponent";
import { SvgIconTypeMap } from "@material-ui/core/SvgIcon";
import { ExternalDocument } from "../types/database";

export interface LabelingState {
  data: LabelingDocument;
  message: string;
  icon?: OverridableComponent<SvgIconTypeMap<unknown, "svg">>;
}

export interface LabelingIndexedState extends LabelingState {
  id: string;
}

export interface LabelingMessage {
  id: string;
  message: string;
  icon?: OverridableComponent<SvgIconTypeMap<unknown, "svg">>;
}

export interface UseLabelingHistoryState {
  history: LabelingIndexedState[];
  index: number;
}

export interface UseLabelingHistoryResult {
  data: LabelingDocument;
  message: string;
  pushLabeling: (
    provider: (data: LabelingDocument) => LabelingState | undefined,
  ) => void;
  undoLabeling: () => void;
  redoLabeling: () => void;
  setLabelingId: (id: string) => void;
  currentId: string;
  undoMessage?: string;
  redoMessage?: string;
  messages: LabelingMessage[];
}

export default function useLabelingHistory(
  document: ExternalDocument,
  maxSize?: number,
): UseLabelingHistoryResult {
  const bufferSize = useRef(maxSize ?? 20);
  const [state, setState] = useState<UseLabelingHistoryState>({
    history: [
      {
        data: createLabelingDocument(document),
        message: "Labeling loaded",
        id: uuidv4(),
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
    (provider: (data: LabelingDocument) => LabelingState | undefined): void =>
      setState(value => {
        const currentLabeling = value.history[value.index].data;
        const result = provider(currentLabeling);
        if (!result) return value;

        const newState = { ...result, id: uuidv4() };
        const newHistory = [...value.history];
        newHistory.splice(value.index + 1);

        if (newHistory.length < bufferSize.current) {
          return {
            history: [...newHistory, newState],
            index: value.index + 1,
          };
        }
        newHistory.shift();
        return {
          history: [...newHistory, newState],
          index: value.index,
        };
      }),
    [setState],
  );
  const setLabelingId = useCallback(
    (id: string): void =>
      setState(value => {
        const newIndex = value.history.findIndex(pair => pair.id === id);
        return {
          ...value,
          index: newIndex === -1 ? value.index : newIndex,
        };
      }),
    [],
  );
  const messages = useMemo(
    () =>
      state.history.map(pair => ({
        message: pair.message,
        id: pair.id,
        icon: pair.icon,
      })),
    [state.history],
  );

  return {
    ...state.history[state.index],
    setLabelingId,
    undoLabeling,
    redoLabeling,
    pushLabeling,
    messages,
    currentId: state.history[state.index]?.id,
    undoMessage: state.history[state.index - 1]?.message,
    redoMessage: state.history[state.index + 1]?.message,
  };
}

import { useCallback, useRef, useState } from "react";
import { ProjectDocument } from "../types";

export enum ProjectStep {
  GENERAL = 0,
  WORKFLOWS = 1,
  USERS = 2,
  SCHEMAS = 3,
}

export interface ProjectState {
  project: ProjectDocument;
  step: ProjectStep;
}

export interface UseProjectHistoryState {
  history: ProjectState[];
  index: number;
}

export type UseProjectHistoryFnc = (
  provider: (state: ProjectState) => ProjectState | undefined,
) => void;

export interface UseProjectHistoryResult {
  project: ProjectDocument;
  step: ProjectStep;
  push: UseProjectHistoryFnc;
  undo: () => void;
  redo: () => void;
}

export default function useProjectHistory(
  project: ProjectDocument,
  step: ProjectStep,
  maxSize?: number,
): UseProjectHistoryResult {
  const bufferSize = useRef(maxSize ?? 20);
  const [state, setState] = useState<UseProjectHistoryState>({
    history: [{ project, step }],
    index: 0,
  });

  const undo = useCallback(
    (): void =>
      setState(value => ({ ...value, index: Math.max(value.index - 1, 0) })),
    [],
  );
  const redo = useCallback(
    (): void =>
      setState(value => ({
        ...value,
        index: Math.min(value.index + 1, value.history.length - 1),
      })),
    [],
  );
  const push = useCallback(
    (provider: (state: ProjectState) => ProjectState | undefined): void =>
      setState(value => {
        const current = value.history[value.index];
        const next = provider(current);
        if (!next) return value;

        const newHistory = [...value.history];
        newHistory.splice(value.index + 1);

        if (newHistory.length < bufferSize.current) {
          return {
            history: [...newHistory, next],
            index: value.index + 1,
          };
        }
        newHistory.shift();
        return {
          history: [...newHistory, next],
          index: value.index,
        };
      }),
    [],
  );

  return {
    ...state.history[state.index],
    undo,
    redo,
    push,
  };
}

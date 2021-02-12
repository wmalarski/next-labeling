import { HISTORY_LIMIT, WorkspaceSnapshot, WorkspaceState } from "./state";

export function addSnapshot(
  state: WorkspaceState,
  snapshot: WorkspaceSnapshot,
): WorkspaceState {
  const newHistory = [...state.history];
  newHistory.slice(state.index + 1);

  if (newHistory.length < HISTORY_LIMIT) {
    return {
      history: [...newHistory, snapshot],
      index: state.index + 1,
    };
  }
  newHistory.shift();
  return {
    history: [...newHistory, snapshot],
    index: state.index,
  };
}

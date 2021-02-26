import { WorkspaceState } from "../state";

export default function undoLabelingAction(
  state: WorkspaceState,
): WorkspaceState {
  return {
    ...state,
    index: Math.max(state.index - 1, 0),
  };
}

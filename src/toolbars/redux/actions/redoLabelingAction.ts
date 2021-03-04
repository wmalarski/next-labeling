import { WorkspaceState } from "../../../workspace/redux/state";

export default function redoLabelingAction(
  state: WorkspaceState,
): WorkspaceState {
  return {
    ...state,
    index: Math.min(state.index + 1, state.history.length - 1),
  };
}

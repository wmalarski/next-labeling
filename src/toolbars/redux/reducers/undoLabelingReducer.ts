import { WorkspaceState } from "../../../workspace/redux/state";

export default function undoLabelingReducer(
  state: WorkspaceState,
): WorkspaceState {
  return {
    ...state,
    index: Math.max(state.index - 1, 0),
  };
}

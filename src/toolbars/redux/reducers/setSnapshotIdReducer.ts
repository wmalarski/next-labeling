import { PayloadAction } from "@reduxjs/toolkit";
import { WorkspaceState } from "../../../workspace/redux/state";

export default function setSnapshotIdReducer(
  state: WorkspaceState,
  action: PayloadAction<string>,
): WorkspaceState {
  const { payload: id } = action;
  const newIndex = state.history.findIndex(pair => pair.id === id);
  return { ...state, index: newIndex };
}

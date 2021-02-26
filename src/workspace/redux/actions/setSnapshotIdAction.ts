import { PayloadAction } from "@reduxjs/toolkit";
import { WorkspaceState } from "../state";

export default function setSnapshotIdAction(
  state: WorkspaceState,
  action: PayloadAction<string>,
): WorkspaceState {
  const { payload: id } = action;
  const newIndex = state.history.findIndex(pair => pair.id === id);
  return { ...state, index: newIndex };
}

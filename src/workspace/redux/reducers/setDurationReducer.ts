import { PayloadAction } from "@reduxjs/toolkit";
import { WorkspaceState } from "../state";

export default function setDurationReducer(
  state: WorkspaceState,
  action: PayloadAction<number>,
): WorkspaceState {
  const { payload } = action;
  return { ...state, duration: payload };
}

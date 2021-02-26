import { PayloadAction } from "@reduxjs/toolkit";
import { WorkspaceState } from "../state";

export default function setDrawingToolAction(
  state: WorkspaceState,
  action: PayloadAction<string | null>,
): WorkspaceState {
  const { payload } = action;
  return { ...state, drawingTool: payload };
}

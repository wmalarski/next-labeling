import { PayloadAction } from "@reduxjs/toolkit";
import { WorkspaceState } from "../../../workspace/redux/state";
import { DrawingTool } from "../../../workspace/types/client";

export default function setDrawingToolAction(
  state: WorkspaceState,
  action: PayloadAction<DrawingTool | null>,
): WorkspaceState {
  const { payload } = action;
  return { ...state, drawingTool: payload };
}

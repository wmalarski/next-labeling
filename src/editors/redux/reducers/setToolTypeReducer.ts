import { PayloadAction } from "@reduxjs/toolkit";
import { WorkspaceState } from "../../../workspace/redux/state";
import { ToolType } from "../../../workspace/types/client";

export default function setToolTypeReducer(
  state: WorkspaceState,
  action: PayloadAction<ToolType>,
): WorkspaceState {
  const { payload } = action;
  return { ...state, toolType: payload };
}

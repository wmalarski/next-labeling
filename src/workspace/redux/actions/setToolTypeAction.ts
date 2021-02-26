import { PayloadAction } from "@reduxjs/toolkit";
import { ToolType } from "../../types/client";
import { WorkspaceState } from "../state";

export default function setToolTypeAction(
  state: WorkspaceState,
  action: PayloadAction<ToolType>,
): WorkspaceState {
  const { payload } = action;
  return { ...state, toolType: payload };
}

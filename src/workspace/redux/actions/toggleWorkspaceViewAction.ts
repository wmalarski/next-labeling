import { PayloadAction } from "@reduxjs/toolkit";
import { toggleView } from "../../views";
import { WorkspaceState } from "../state";

export default function toggleWorkspaceViewAction(
  state: WorkspaceState,
  action: PayloadAction<string>,
): WorkspaceState {
  const { payload } = action;
  return {
    ...state,
    preferences: {
      ...state.preferences,
      views: toggleView(state.preferences.views, payload),
    },
  };
}

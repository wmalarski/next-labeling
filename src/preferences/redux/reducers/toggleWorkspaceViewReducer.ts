import { PayloadAction } from "@reduxjs/toolkit";
import { WorkspaceState } from "../../../workspace/redux/state";
import { toggleView } from "../../../workspace/views";

export default function toggleWorkspaceViewReducer(
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

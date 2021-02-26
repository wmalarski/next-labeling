import { PayloadAction } from "@reduxjs/toolkit";
import GridLayout from "react-grid-layout";
import { updateView } from "../../views";
import { WorkspaceState } from "../state";

export interface UpdateWorkspaceViewActionPayload {
  key: string;
  options?: Partial<GridLayout.Layout>;
}

export default function updateWorkspaceViewAction(
  state: WorkspaceState,
  action: PayloadAction<UpdateWorkspaceViewActionPayload>,
): WorkspaceState {
  const { payload } = action;
  const { key, options } = payload;
  return {
    ...state,
    preferences: {
      ...state.preferences,
      views: updateView(state.preferences.views, key, options),
    },
  };
}

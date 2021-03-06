import { PayloadAction } from "@reduxjs/toolkit";
import {
  PreferencesState,
  WorkspaceState,
} from "../../../workspace/redux/state";

export default function setPreferencesReducer(
  state: WorkspaceState,
  action: PayloadAction<Partial<PreferencesState>>,
): WorkspaceState {
  const { payload } = action;
  return {
    ...state,
    preferences: {
      ...state.preferences,
      ...payload,
    },
  };
}

import { PayloadAction } from "@reduxjs/toolkit";
import { WorkspaceState } from "../../../workspace/redux/state";
import { ShortcutAction } from "../../../workspace/shortcuts";

export interface SetShortcutActionPayload {
  action: ShortcutAction;
  key: string;
}

export default function setShortcutAction(
  state: WorkspaceState,
  action: PayloadAction<SetShortcutActionPayload>,
): WorkspaceState {
  const { payload } = action;
  const { action: shortcutAction, key } = payload;
  return {
    ...state,
    preferences: {
      ...state.preferences,
      shortcuts: {
        ...state.preferences.shortcuts,
        [shortcutAction]: key,
      },
    },
  };
}

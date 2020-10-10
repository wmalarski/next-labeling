import { createContext } from "react";
import { defaultShortcutActions, ShortcutActions } from "../shortcuts";

export enum LabelingDirection {
  FORWARD = "FORWARD",
  BACKWARD = "BACKWARD",
}

export interface PreferencesContextState {
  labelingDirection: LabelingDirection;
  frameChangeStep: number;
  shortcuts: ShortcutActions;
}

export const defaultPreferencesContextState: PreferencesContextState = {
  labelingDirection: LabelingDirection.FORWARD,
  frameChangeStep: 1,
  shortcuts: defaultShortcutActions,
};

export interface PreferencesContextValue {
  setPreferences: (settings: PreferencesContextState) => void;
  preferences: PreferencesContextState;
}

const PreferencesContext = createContext<PreferencesContextValue>({
  setPreferences: () => void 0,
  preferences: defaultPreferencesContextState,
});

export default PreferencesContext;

import { createContext } from "react";
import { defaultShortcutActions, ShortcutActions } from "../shortcuts";
import { defaultLabelingViews, LabelingViews } from "../views";

export enum LabelingDirection {
  FORWARD = "FORWARD",
  BACKWARD = "BACKWARD",
}

export interface PreferencesContextState {
  labelingDirection: LabelingDirection;
  frameChangeStep: number;
  shortcuts: ShortcutActions;
  autoSaveDelayMinutes: number | null;
  views: LabelingViews;
}

export const defaultPreferencesContextState: PreferencesContextState = {
  labelingDirection: LabelingDirection.FORWARD,
  frameChangeStep: 1,
  shortcuts: defaultShortcutActions,
  autoSaveDelayMinutes: 1,
  views: defaultLabelingViews,
};

export interface PreferencesContextValue {
  setPreferences: (settings: PreferencesContextState) => void;
  setViews: (provider: (views: LabelingViews) => LabelingViews) => void;
  preferences: PreferencesContextState;
}

const PreferencesContext = createContext<PreferencesContextValue>({
  setPreferences: () => void 0,
  setViews: () => void 0,
  preferences: defaultPreferencesContextState,
});

export default PreferencesContext;

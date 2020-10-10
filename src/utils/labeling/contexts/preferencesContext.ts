import { createContext } from "react";

export enum LabelingDirection {
  FORWARD = "FORWARD",
  BACKWARD = "BACKWARD",
}

export interface PreferencesContextState {
  labelingDirection: LabelingDirection;
  frameChangeStep: number;
}

export const defaultPreferencesContextState = {
  labelingDirection: LabelingDirection.FORWARD,
  frameChangeStep: 1,
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

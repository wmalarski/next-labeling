import React, { useCallback, useEffect, useState } from "react";
import PreferencesContext, {
  defaultPreferencesContextState,
  PreferencesContextState,
} from "../../../labeling/contexts/preferencesContext";

export const preferencesStorageKey = "preferences";

export interface PreferencesProviderProps {
  children: React.ReactNode | React.ReactNode[] | null;
}

export default function PreferencesProvider(
  props: PreferencesProviderProps,
): JSX.Element {
  const { children } = props;

  const [state, setState] = useState<PreferencesContextState>(
    defaultPreferencesContextState,
  );

  const setPreferences = useCallback((preferences: PreferencesContextState) => {
    localStorage.setItem(preferencesStorageKey, JSON.stringify(preferences));
    setState(preferences);
  }, []);

  const setViews = useCallback(
    provider => setState(state => ({ ...state, views: provider(state.views) })),
    [],
  );

  useEffect(
    () =>
      setState(() => {
        const preferences = localStorage.getItem(preferencesStorageKey);
        const newPreferences = preferences
          ? {
              ...defaultPreferencesContextState,
              ...JSON.parse(preferences),
            }
          : defaultPreferencesContextState;
        localStorage.setItem(
          preferencesStorageKey,
          JSON.stringify(newPreferences),
        );
        return newPreferences;
      }),
    [],
  );

  return (
    <PreferencesContext.Provider
      value={{
        setViews,
        setPreferences,
        preferences: state,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

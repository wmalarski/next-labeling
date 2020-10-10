import React, { useCallback, useEffect } from "react";

import PreferencesContext, {
  defaultPreferencesContextState,
  PreferencesContextState,
} from "../../utils/labeling/contexts/preferencesContext";

export const preferencesStorageKey = "preferences";

export interface PreferencesProviderProps {
  children: React.ReactNode | React.ReactNode[] | null;
}

export default function PreferencesProvider(
  props: PreferencesProviderProps,
): JSX.Element {
  const { children } = props;

  const setPreferences = useCallback(
    (preferences: PreferencesContextState) =>
      localStorage.setItem(preferencesStorageKey, JSON.stringify(preferences)),
    [],
  );

  const getOrCreatePreferences = useCallback((): PreferencesContextState => {
    const preferences = localStorage.getItem(preferencesStorageKey);
    if (preferences) return JSON.parse(preferences);
    setPreferences(defaultPreferencesContextState);
    return defaultPreferencesContextState;
  }, [setPreferences]);

  useEffect(() => {
    getOrCreatePreferences();
  }, [getOrCreatePreferences]);

  return (
    <PreferencesContext.Provider
      value={{
        setPreferences,
        preferences:
          typeof window === "undefined"
            ? defaultPreferencesContextState
            : getOrCreatePreferences(),
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

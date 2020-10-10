import React, { useCallback, useEffect, useState } from "react";

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

  const [state, setState] = useState<PreferencesContextState>(
    defaultPreferencesContextState,
  );

  const setPreferences = useCallback((preferences: PreferencesContextState) => {
    localStorage.setItem(preferencesStorageKey, JSON.stringify(preferences));
    setState(preferences);
  }, []);

  useEffect(
    () =>
      setState(() => {
        const preferences = localStorage.getItem(preferencesStorageKey);
        if (preferences) return JSON.parse(preferences);
        return defaultPreferencesContextState;
      }),
    [],
  );

  return (
    <PreferencesContext.Provider
      value={{
        setPreferences,
        preferences: state,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

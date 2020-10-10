import { useContext } from "react";

import PreferencesContext, {
  PreferencesContextValue,
} from "../contexts/preferencesContext";

export default function usePreferences(): PreferencesContextValue {
  return useContext(PreferencesContext);
}

import { useCallback } from "react";
import { useInterval } from "../../common/hooks/useInterval";
import { ExternalDocument } from "../types/database";
import useLabelingContext from "./useLabelingContext";
import usePreferences from "./usePreferencesContext";

export const OneMinuteMs = 60000;

export default function useLabelingAutoSave(): void {
  const { document, saveLabeling, history } = useLabelingContext();
  const { data } = history;

  const { preferences } = usePreferences();
  const delayMinutes = preferences.autoSaveDelayMinutes;

  const callback = useCallback(
    () =>
      saveLabeling(
        ExternalDocument.encode({
          ...document,
          objects: data.objects,
        }),
      ),
    [data.objects, document, saveLabeling],
  );

  useInterval(callback, delayMinutes ? delayMinutes * OneMinuteMs : null);
}

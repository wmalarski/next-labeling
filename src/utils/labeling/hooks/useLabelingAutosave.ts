import { useCallback } from "react";
import { useInterval } from "../../common/useInterval";
import { LabelingDocument } from "../types";
import useLabelingContext from "./useLabelingContext";
import usePreferences from "./usePreferencesContext";

export const OneMinuteMs = 60000;

export function useLabelingAutosave(): void {
  const { document, saveLabeling, history } = useLabelingContext();
  const { data } = history;

  const { preferences } = usePreferences();
  const delayMinutes = preferences.autoSaveDelayMinutes;

  const callback = useCallback(
    () =>
      saveLabeling(
        LabelingDocument.encode({
          ...document,
          objects: data.objects,
        }),
      ),
    [data.objects, document, saveLabeling],
  );

  useInterval(callback, delayMinutes ? delayMinutes * OneMinuteMs : null);
}

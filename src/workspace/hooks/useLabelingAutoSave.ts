import { useCallback } from "react";
import { useSelector } from "react-redux";
import { useInterval } from "../../common/hooks/useInterval";
import { initialDocumentSelector } from "../redux/selectors/common-selectors";
import { objectsSelector } from "../redux/selectors/doc-selectors";
import { autoSaveDelayMinutesSelector } from "../redux/selectors/preferences-selectors";
import { ExternalDocument } from "../types/database";
import useLabelingContext from "./useLabelingContext";

export const OneMinuteMs = 60000;

export default function useLabelingAutoSave(): void {
  const { saveLabeling } = useLabelingContext();

  const initialDocument = useSelector(initialDocumentSelector);
  const delayMinutes = useSelector(autoSaveDelayMinutesSelector);
  const objects = useSelector(objectsSelector);

  const callback = useCallback(
    () =>
      saveLabeling(ExternalDocument.encode({ ...initialDocument, objects })),
    [objects, initialDocument, saveLabeling],
  );

  useInterval(callback, delayMinutes ? delayMinutes * OneMinuteMs : null);
}

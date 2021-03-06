import compact from "lodash/compact";
import { snapshotPrepare } from "../../../common/redux/functions";
import { SnapshotPayloadAction } from "../../../common/redux/types";
import { currentDocumentSelector } from "../selectors";
import { WorkspaceState } from "../state";
import setSelectedAction from "./setSelectedAction";

export interface DeselectObjectPayload {
  objectId: string;
  reset: boolean;
  fieldId?: string;
}

export function reducer(
  state: WorkspaceState,
  action: SnapshotPayloadAction<DeselectObjectPayload>,
): WorkspaceState {
  const data = currentDocumentSelector.resultFunc(state);
  const { payload } = action;
  const { objectId, reset, fieldId } = payload;

  const selected =
    reset && !fieldId
      ? []
      : compact(
          data.selected.map(sel => {
            if (sel.objectId !== objectId) return sel;
            if (!fieldId) return null;
            return {
              ...sel,
              fieldIds: reset ? [] : sel.fieldIds.filter(f => f !== fieldId),
            };
          }),
        );

  return setSelectedAction.reducer(state, { ...action, payload: selected });
}

export default {
  reducer,
  prepare: (payload: DeselectObjectPayload) => snapshotPrepare(payload),
};

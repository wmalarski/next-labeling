import { snapshotPrepare } from "../../../common/redux/functions";
import { SnapshotPayloadAction } from "../../../common/redux/types";
import { LabelingObject } from "../../types/client";
import { currentDocumentSelector } from "../selectors";
import { WorkspaceState } from "../state";
import setSelectedAction from "./setSelectedReducer";

export interface SelectObjectPayload {
  object: LabelingObject;
  reset: boolean;
  fieldId?: string;
}

export function reducer(
  state: WorkspaceState,
  action: SnapshotPayloadAction<SelectObjectPayload>,
): WorkspaceState {
  const data = currentDocumentSelector.resultFunc(state);
  const { selected } = data;
  const { object, reset, fieldId } = action.payload;

  const index = selected.findIndex(sel => sel.objectId === object.id);
  if (index === -1)
    return setSelectedAction.reducer(state, {
      ...action,
      payload: [
        ...(reset ? [] : selected),
        {
          fieldIds: fieldId ? [fieldId] : [],
          objectId: object.id,
          objectSelected: !fieldId,
          singleton: object.objectSchema.singleton,
        },
      ],
    });

  const selection = selected[index];
  const newSelection = {
    ...selection,
    ...(!fieldId
      ? {
          objectSelected: true,
          fieldIds: reset ? [] : selection.fieldIds,
        }
      : {
          objectSelected: reset ? false : selection.objectSelected,
          fieldIds: reset ? [fieldId] : [...selection.fieldIds, fieldId],
        }),
  };
  if (reset)
    return setSelectedAction.reducer(state, {
      ...action,
      payload: [newSelection],
    });

  const newSelected = [...selected];
  newSelected.splice(index, 1, newSelection);
  return setSelectedAction.reducer(state, { ...action, payload: newSelected });
}

export default {
  reducer,
  prepare: (payload: SelectObjectPayload) => snapshotPrepare(payload),
};

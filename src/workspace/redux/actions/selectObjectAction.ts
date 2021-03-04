import { PayloadAction } from "@reduxjs/toolkit";
import { LabelingObject } from "../../types/client";
import { currentDocumentSelector } from "../selectors";
import { WorkspaceState } from "../state";
import setSelectedAction from "./setSelectedAction";

export interface SelectObjectActionPayload {
  object: LabelingObject;
  reset: boolean;
  fieldId?: string;
}

export default function selectObjectAction(
  state: WorkspaceState,
  action: PayloadAction<SelectObjectActionPayload>,
): WorkspaceState {
  const data = currentDocumentSelector.resultFunc(state);
  const { selected } = data;
  const { object, reset, fieldId } = action.payload;

  const index = selected.findIndex(sel => sel.objectId === object.id);
  if (index === -1)
    return setSelectedAction(state, {
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
    return setSelectedAction(state, { ...action, payload: [newSelection] });

  const newSelected = [...selected];
  newSelected.splice(index, 1, newSelection);
  return setSelectedAction(state, { ...action, payload: newSelected });
}

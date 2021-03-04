import { PayloadAction } from "@reduxjs/toolkit";
import compact from "lodash/compact";
import { currentDocumentSelector } from "../selectors";
import { WorkspaceState } from "../state";
import setSelectedAction from "./setSelectedAction";

export interface DeselectObjectActionPayload {
  objectId: string;
  reset: boolean;
  fieldId?: string;
}

export default function deselectObjectAction(
  state: WorkspaceState,
  action: PayloadAction<DeselectObjectActionPayload>,
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

  return setSelectedAction(state, { ...action, payload: selected });
}

import { PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { LabelingAction } from "../../types/client";
import { addSnapshot } from "../functions";
import { currentDocumentSelector } from "../selectors";
import { WorkspaceState } from "../state";

export default function setToggledAction(
  state: WorkspaceState,
  action: PayloadAction<string>,
): WorkspaceState {
  const data = currentDocumentSelector.resultFunc(state);
  const { toggled } = data;
  const { payload: id } = action;

  const newToggled = toggled.includes(id)
    ? toggled.filter(t => t !== id)
    : [...toggled, id];

  return addSnapshot(state, {
    id: uuidv4(),
    message: "Selection changed",
    action: LabelingAction.SELECTION_CHANGE,
    data: { ...data, toggled: newToggled },
  });
}

import SelectAllIcon from "@material-ui/icons/SelectAll";
import { PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { addSnapshot } from "../functions";
import { currentDocumentSelector } from "../selectors";
import { WorkspaceState } from "../state";

export default function setToggledAction(
  state: WorkspaceState,
  action: PayloadAction<string[]>,
): WorkspaceState {
  const data = currentDocumentSelector.resultFunc(state);
  const { payload: toggled } = action;

  return addSnapshot(state, {
    id: uuidv4(),
    message: "Selection changed",
    icon: SelectAllIcon,
    data: { ...data, toggled },
  });
}

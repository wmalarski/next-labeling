import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { LabelingObject } from "../../types/client";
import { addSnapshot } from "../functions";
import { currentDocumentSelector } from "../selectors/doc-selectors";
import { WorkspaceState } from "../state";

export interface SetIsDoneActionPayload {
  object: LabelingObject;
  checked: boolean;
}

export default function setIsDoneAction(
  state: WorkspaceState,
  action: PayloadAction<SetIsDoneActionPayload>,
): WorkspaceState {
  const data = currentDocumentSelector.resultFunc(state);
  const { object, checked } = action.payload;

  const objectIndex = data.objects.findIndex(obj => obj.id === object.id);
  const objects = [...data.objects];
  objects[objectIndex] = { ...objects[objectIndex], isDone: checked };
  return addSnapshot(state, {
    id: uuidv4(),
    message: `Done value changed to ${checked}`,
    icon: CheckCircleIcon,
    data: { ...data, objects },
  });
}

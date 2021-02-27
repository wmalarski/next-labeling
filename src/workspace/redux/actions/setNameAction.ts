import EditIcon from "@material-ui/icons/Edit";
import { PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { LabelingObject } from "../../types/client";
import { addSnapshot } from "../functions";
import { currentDocumentSelector } from "../selectors";
import { WorkspaceState } from "../state";

export interface SetNameActionPayload {
  object: LabelingObject;
  name: string;
}

export default function setNameAction(
  state: WorkspaceState,
  action: PayloadAction<SetNameActionPayload>,
): WorkspaceState {
  const data = currentDocumentSelector.resultFunc(state);
  const { object, name } = action.payload;

  const objectIndex = data.objects.findIndex(obj => obj.id === object.id);
  const objects = [...data.objects];
  objects[objectIndex] = { ...objects[objectIndex], name };
  return addSnapshot(state, {
    id: uuidv4(),
    message: `Name '${object.name}' changed to '${name}'`,
    icon: EditIcon,
    data: { ...data, objects },
  });
}

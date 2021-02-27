import ImageSearchIcon from "@material-ui/icons/ImageSearch";
import { PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { LabelingObject } from "../../types/client";
import { addSnapshot } from "../functions";
import { currentDocumentSelector } from "../selectors/doc-selectors";
import { WorkspaceState } from "../state";

export interface SetIsTrackedActionPayload {
  object: LabelingObject;
  checked: boolean;
}

export default function setIsTrackedAction(
  state: WorkspaceState,
  action: PayloadAction<SetIsTrackedActionPayload>,
): WorkspaceState {
  const data = currentDocumentSelector.resultFunc(state);
  const { object, checked } = action.payload;

  const objectIndex = data.objects.findIndex(obj => obj.id === object.id);
  const objects = [...data.objects];
  objects[objectIndex] = { ...objects[objectIndex], isTracked: checked };
  return addSnapshot(state, {
    id: uuidv4(),
    message: `Tracked value changed to ${checked}`,
    icon: ImageSearchIcon,
    data: { ...data, objects },
  });
}

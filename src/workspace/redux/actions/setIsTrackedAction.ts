import { PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { LabelingAction, LabelingObject } from "../../types/client";
import { addSnapshot } from "../functions";
import { currentDocumentSelector } from "../selectors";
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
    action: LabelingAction.SET_IS_TRACKED,
    data: { ...data, objects },
  });
}

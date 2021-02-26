import { PayloadAction } from "@reduxjs/toolkit";
import { getFirstFrame } from "../../functions";
import { currentDocumentSelector } from "../selectors";
import { WorkspaceState } from "../state";
import setCurrentFrameAction from "./setCurrentFrameAction";

export interface SetObjectFirstFrameActionPayload {
  propagationStep: number;
}

export default function setObjectFirstFrameAction(
  state: WorkspaceState,
  action: PayloadAction<SetObjectFirstFrameActionPayload>,
): WorkspaceState {
  const data = currentDocumentSelector.resultFunc(state);
  const { selected } = data;

  const { propagationStep } = action.payload;

  const selectedObjects = selected.filter(
    object => !object.singleton && object.objectSelected,
  );
  const selectedObjectsIds = selectedObjects.map(object => object.objectId);
  const nextFrame = getFirstFrame(data, selectedObjectsIds);

  return nextFrame
    ? setCurrentFrameAction(state, {
        ...action,
        payload: { nextFrame, propagationStep },
      })
    : state;
}

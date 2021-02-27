import { PayloadAction } from "@reduxjs/toolkit";
import { getLastFrame } from "../../functions";
import { currentDocumentSelector } from "../selectors";
import { WorkspaceState } from "../state";
import setCurrentFrameAction from "./setCurrentFrameAction";

export default function setObjectLastFrameAction(
  state: WorkspaceState,
  action: PayloadAction,
): WorkspaceState {
  const data = currentDocumentSelector.resultFunc(state);
  const { selected } = data;

  const selectedObjects = selected.filter(
    object => !object.singleton && object.objectSelected,
  );
  const selectedObjectsIds = selectedObjects.map(object => object.objectId);
  const nextFrame = getLastFrame(data, selectedObjectsIds);

  return nextFrame
    ? setCurrentFrameAction(state, {
        ...action,
        payload: { nextFrame },
      })
    : state;
}

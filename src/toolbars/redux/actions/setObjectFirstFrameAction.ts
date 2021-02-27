import { PayloadAction } from "@reduxjs/toolkit";
import { getFirstFrame } from "../../../workspace/functions";
import setCurrentFrameAction from "../../../workspace/redux/actions/setCurrentFrameAction";
import { currentDocumentSelector } from "../../../workspace/redux/selectors";
import { WorkspaceState } from "../../../workspace/redux/state";

export default function setObjectFirstFrameAction(
  state: WorkspaceState,
  action: PayloadAction,
): WorkspaceState {
  const data = currentDocumentSelector.resultFunc(state);
  const { selected } = data;

  const selectedObjects = selected.filter(
    object => !object.singleton && object.objectSelected,
  );
  const selectedObjectsIds = selectedObjects.map(object => object.objectId);
  const nextFrame = getFirstFrame(data, selectedObjectsIds);

  return nextFrame
    ? setCurrentFrameAction(state, {
        ...action,
        payload: { nextFrame },
      })
    : state;
}

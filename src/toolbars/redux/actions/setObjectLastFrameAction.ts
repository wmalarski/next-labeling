import { snapshotPrepare } from "../../../common/redux/functions";
import { SnapshotPayloadAction } from "../../../common/redux/types";
import { getLastFrame } from "../../../workspace/functions";
import setCurrentFrameAction from "../../../workspace/redux/actions/setCurrentFrameAction";
import { currentDocumentSelector } from "../../../workspace/redux/selectors";
import { WorkspaceState } from "../../../workspace/redux/state";

export function reducer(
  state: WorkspaceState,
  action: SnapshotPayloadAction<{}>,
): WorkspaceState {
  const data = currentDocumentSelector.resultFunc(state);
  const { selected } = data;

  const selectedObjects = selected.filter(
    object => !object.singleton && object.objectSelected,
  );
  const selectedObjectsIds = selectedObjects.map(object => object.objectId);
  const nextFrame = getLastFrame(data, selectedObjectsIds);

  return nextFrame
    ? setCurrentFrameAction.reducer(state, {
        ...action,
        payload: { nextFrame },
      })
    : state;
}

export default {
  reducer,
  prepare: () => snapshotPrepare({}),
};

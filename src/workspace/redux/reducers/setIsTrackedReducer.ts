import { snapshotPrepare } from "../../../common/redux/functions";
import { SnapshotPayloadAction } from "../../../common/redux/types";
import { LabelingAction, LabelingObject } from "../../types/client";
import { addSnapshot } from "../functions";
import { currentDocumentSelector } from "../selectors";
import { WorkspaceState } from "../state";

export interface SetIsTrackedPayload {
  object: LabelingObject;
  checked: boolean;
}

export function reducer(
  state: WorkspaceState,
  action: SnapshotPayloadAction<SetIsTrackedPayload>,
): WorkspaceState {
  const data = currentDocumentSelector.resultFunc(state);
  const { object, checked } = action.payload;

  const objectIndex = data.objects.findIndex(obj => obj.id === object.id);
  const objects = [...data.objects];
  objects[objectIndex] = { ...objects[objectIndex], isTracked: checked };
  return addSnapshot(state, {
    id: action.meta.snapshotId,
    message: `Tracked value changed to ${checked}`,
    action: LabelingAction.SET_IS_TRACKED,
    data: { ...data, objects },
  });
}

export default {
  reducer,
  prepare: (payload: SetIsTrackedPayload) => snapshotPrepare(payload),
};

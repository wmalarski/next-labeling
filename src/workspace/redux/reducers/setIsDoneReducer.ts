import { snapshotPrepare } from "../../../common/redux/functions";
import { SnapshotPayloadAction } from "../../../common/redux/types";
import { LabelingAction, LabelingObject } from "../../types/client";
import { addSnapshot } from "../functions";
import { currentDocumentSelector } from "../selectors";
import { WorkspaceState } from "../state";

export interface SetIsDonePayload {
  object: LabelingObject;
  checked: boolean;
}

export function reducer(
  state: WorkspaceState,
  action: SnapshotPayloadAction<SetIsDonePayload>,
): WorkspaceState {
  const data = currentDocumentSelector.resultFunc(state);
  const { object, checked } = action.payload;

  const objectIndex = data.objects.findIndex(obj => obj.id === object.id);
  const objects = [...data.objects];
  objects[objectIndex] = { ...objects[objectIndex], isDone: checked };
  return addSnapshot(state, {
    id: action.meta.snapshotId,
    message: `Done value changed to ${checked}`,
    action: LabelingAction.SET_IS_DONE,
    data: { ...data, objects },
  });
}

export default {
  reducer,
  prepare: (payload: SetIsDonePayload) => snapshotPrepare(payload),
};

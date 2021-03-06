import { snapshotPrepare } from "../../../common/redux/functions";
import { SnapshotPayloadAction } from "../../../common/redux/types";
import { LabelingAction, LabelingObject } from "../../types/client";
import { addSnapshot } from "../functions";
import { currentDocumentSelector } from "../selectors";
import { WorkspaceState } from "../state";

export interface SetNamePayload {
  object: LabelingObject;
  name: string;
}

export function reducer(
  state: WorkspaceState,
  action: SnapshotPayloadAction<SetNamePayload>,
): WorkspaceState {
  const data = currentDocumentSelector.resultFunc(state);
  const { object, name } = action.payload;

  const objectIndex = data.objects.findIndex(obj => obj.id === object.id);
  const objects = [...data.objects];
  objects[objectIndex] = { ...objects[objectIndex], name };
  return addSnapshot(state, {
    id: action.meta.snapshotId,
    message: `Name '${object.name}' changed to '${name}'`,
    action: LabelingAction.SET_NAME,
    data: { ...data, objects },
  });
}

export default {
  reducer,
  prepare: (payload: SetNamePayload) => snapshotPrepare(payload),
};

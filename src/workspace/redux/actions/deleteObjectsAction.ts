import { snapshotPrepare } from "../../../common/redux/functions";
import { SnapshotPayloadAction } from "../../../common/redux/types";
import { LabelingAction } from "../../types/client";
import { addSnapshot } from "../functions";
import { currentDocumentSelector } from "../selectors";
import { WorkspaceState } from "../state";

export function reducer(
  state: WorkspaceState,
  action: SnapshotPayloadAction<{}>,
): WorkspaceState {
  const data = currentDocumentSelector.resultFunc(state);

  const ids = data.selected
    .filter(object => object.objectSelected)
    .map(object => object.objectId);
  return addSnapshot(state, {
    id: action.meta.snapshotId,
    message: "Objects removed",
    action: LabelingAction.DELETE_OBJECTS,
    data: {
      ...data,
      objects: data.objects.filter(object => !ids.includes(object.id)),
    },
  });
}

export default {
  reducer,
  prepare: () => snapshotPrepare({}),
};

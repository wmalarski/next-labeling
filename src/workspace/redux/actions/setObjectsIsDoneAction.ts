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

  const objects = data.selected.filter(object => object.objectSelected);
  const firstId = objects[0]?.objectId;
  const firstObject = data.objects.find(object => object.id === firstId);
  const firstIsDone = firstObject?.isDone;

  const ids = objects.map(object => object.objectId);
  return addSnapshot(state, {
    id: action.meta.snapshotId,
    message: "Objects Done toggled",
    action: LabelingAction.SET_IS_DONE,
    data: {
      ...data,
      objects: data.objects.map(object =>
        !ids.includes(object.id)
          ? object
          : {
              ...object,
              isDone: !firstIsDone,
            },
      ),
    },
  });
}

export default {
  reducer,
  prepare: () => snapshotPrepare({}),
};

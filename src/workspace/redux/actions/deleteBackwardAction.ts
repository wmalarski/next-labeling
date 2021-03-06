import compact from "lodash/compact";
import { snapshotPrepare } from "../../../common/redux/functions";
import { SnapshotPayloadAction } from "../../../common/redux/types";
import { deleteObjectBackward } from "../../functions";
import { LabelingAction } from "../../types/client";
import { addSnapshot } from "../functions";
import { currentDocumentSelector } from "../selectors";
import { WorkspaceState } from "../state";

export function reducer(
  state: WorkspaceState,
  action: SnapshotPayloadAction<{}>,
): WorkspaceState {
  const data = currentDocumentSelector.resultFunc(state);

  const currentFrame = data.currentFrame;
  const ids = data.selected
    .filter(object => object.objectSelected)
    .map(object => object.objectId);

  return addSnapshot(state, {
    id: action.meta.snapshotId,
    message: "Objects deleted forward",
    action: LabelingAction.DELETE_BACKWARD,
    data: {
      ...data,
      objects: compact(
        data.objects.map(object =>
          !ids.includes(object.id)
            ? object
            : deleteObjectBackward(object, currentFrame),
        ),
      ),
    },
  });
}

export default {
  reducer,
  prepare: () => snapshotPrepare({}),
};

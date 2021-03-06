import compact from "lodash/compact";
import { snapshotPrepare } from "../../../common/redux/functions";
import { SnapshotPayloadAction } from "../../../common/redux/types";
import { deleteObjectForward } from "../../functions";
import { LabelingAction } from "../../types/client";
import { addSnapshot } from "../functions";
import { currentDocumentSelector } from "../selectors";
import { WorkspaceState } from "../state";

export function reducer(
  state: WorkspaceState,
  action: SnapshotPayloadAction<{}>,
): WorkspaceState {
  const data = currentDocumentSelector.resultFunc(state);
  const { currentFrame } = data;

  const ids = data.selected
    .filter(object => object.objectSelected)
    .map(object => object.objectId);

  return addSnapshot(state, {
    id: action.meta.snapshotId,
    message: "Objects deleted forward",
    action: LabelingAction.DELETE_FORWARD,
    data: {
      ...data,
      objects: compact(
        data.objects.map(object =>
          !ids.includes(object.id)
            ? object
            : deleteObjectForward(object, currentFrame),
        ),
      ),
    },
  });
}

export default {
  reducer,
  prepare: () => snapshotPrepare({}),
};

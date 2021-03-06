import { CommentSnapshot } from "../../../comments/types";
import { snapshotPrepare } from "../../../common/redux/functions";
import { SnapshotPayloadAction } from "../../../common/redux/types";
import { createLabelingObjects } from "../../../workspace/functions";
import { addSnapshot } from "../../../workspace/redux/functions";
import {
  currentDocumentSelector,
  initialDocumentSelector,
  schemaSelector,
} from "../../../workspace/redux/selectors";
import { WorkspaceState } from "../../../workspace/redux/state";
import { LabelingAction } from "../../../workspace/types/client";

export interface SetSnapshotPayload {
  snapshot: CommentSnapshot;
}

export function reducer(
  state: WorkspaceState,
  action: SnapshotPayloadAction<SetSnapshotPayload>,
): WorkspaceState {
  const initial = initialDocumentSelector.resultFunc(state);
  const schema = schemaSelector.resultFunc(initial);
  const data = currentDocumentSelector.resultFunc(state);
  const { snapshot } = action.payload;

  const { currentFrame, objects, selected, toggled } = snapshot;
  return addSnapshot(state, {
    id: action.meta.snapshotId,
    message: "Snapshot loaded",
    action: LabelingAction.SET_SNAPSHOT,
    data: {
      ...data,
      currentFrame,
      selected,
      toggled,
      objects: objects ? createLabelingObjects(objects, schema) : data.objects,
    },
  });
}

export default {
  reducer,
  prepare: (payload: SetSnapshotPayload) => snapshotPrepare(payload),
};

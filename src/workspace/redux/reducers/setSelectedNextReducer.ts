import { snapshotPrepare } from "../../../common/redux/functions";
import { SnapshotPayloadAction } from "../../../common/redux/types";
import { LabelingAction } from "../../types/client";
import { addSnapshot } from "../functions";
import { currentDocumentSelector } from "../selectors";
import { WorkspaceState } from "../state";

export function reducer(
  state: WorkspaceState,
  action: SnapshotPayloadAction<number>,
): WorkspaceState {
  const data = currentDocumentSelector.resultFunc(state);
  const { payload: change } = action;

  const { currentFrame, objects, selected } = data;

  const selectedIds = selected
    .filter(object => object.objectSelected)
    .map(object => object.objectId);

  const objectsInFrame = objects.filter(object =>
    object.frames?.includes(currentFrame),
  );
  const firstSelectedIndex = objectsInFrame.findIndex(object =>
    selectedIds.includes(object.id),
  );

  const nextSelectedIndex =
    firstSelectedIndex === -1
      ? 0
      : (firstSelectedIndex + change + objectsInFrame.length) %
        objectsInFrame.length;

  const firstObject = objectsInFrame[nextSelectedIndex];

  return addSnapshot(state, {
    id: action.meta.snapshotId,
    message: "Selection changed",
    action: LabelingAction.SELECTION_CHANGE,
    data: {
      ...data,
      selected: firstObject
        ? [
            {
              fieldIds: firstObject.fields.map(field => field.id),
              singleton: firstObject.objectSchema.singleton,
              objectId: firstObject.id,
              objectSelected: true,
            },
          ]
        : [],
    },
  });
}

export default {
  reducer,
  prepare: (payload: number) => snapshotPrepare(payload),
};

import { snapshotPrepare } from "../../../common/redux/functions";
import { SnapshotPayloadAction } from "../../../common/redux/types";
import { getFrames } from "../../functions";
import { LabelingAction, ObjectSelection } from "../../types/client";
import { addSnapshot } from "../functions";
import { currentDocumentSelector } from "../selectors";
import { WorkspaceState } from "../state";

export function reducer(
  state: WorkspaceState,
  action: SnapshotPayloadAction<ObjectSelection[]>,
): WorkspaceState {
  const data = currentDocumentSelector.resultFunc(state);
  const { payload: selected } = action;

  const { currentFrame } = data;
  const ids = data.selected.map(selection => selection.objectId);
  const newIds = selected
    .filter(selection => !ids.includes(selection.objectId))
    .map(selection => selection.objectId);

  const frames = getFrames(data, newIds);
  const newFrame =
    frames.length === 0 || frames.includes(currentFrame)
      ? currentFrame
      : Math.min(...frames);

  return addSnapshot(state, {
    id: action.meta.snapshotId,
    message: "Selection changed",
    action: LabelingAction.SELECTION_CHANGE,
    data: { ...data, selected, currentFrame: newFrame },
  });
}

export default {
  reducer,
  prepare: (payload: ObjectSelection[]) => snapshotPrepare(payload),
};

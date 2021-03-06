import { snapshotPrepare } from "../../../common/redux/functions";
import { SnapshotPayloadAction } from "../../../common/redux/types";
import { LabelingAction } from "../../types/client";
import { addSnapshot } from "../functions";
import { currentDocumentSelector } from "../selectors";
import { WorkspaceState } from "../state";

export function reducer(
  state: WorkspaceState,
  action: SnapshotPayloadAction<string>,
): WorkspaceState {
  const data = currentDocumentSelector.resultFunc(state);
  const { toggled } = data;
  const { payload: id } = action;

  const newToggled = toggled.includes(id)
    ? toggled.filter(t => t !== id)
    : [...toggled, id];

  return addSnapshot(state, {
    id: action.meta.snapshotId,
    message: "Selection changed",
    action: LabelingAction.SELECTION_CHANGE,
    data: { ...data, toggled: newToggled },
  });
}

export default {
  reducer,
  prepare: (payload: string) => snapshotPrepare(payload),
};

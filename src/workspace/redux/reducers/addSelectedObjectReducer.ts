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
  const { payload: selectedId } = action;

  return addSnapshot(state, {
    id: action.meta.snapshotId,
    message: "Selection changed",
    action: LabelingAction.SELECTION_CHANGE,
    data: {
      ...data,
      selected: [
        ...data.selected,
        {
          fieldIds: [],
          objectId: selectedId,
          objectSelected: true,
          singleton:
            data.objects.find(object => object.id === selectedId)?.objectSchema
              .singleton ?? true,
        },
      ],
    },
  });
}

export default {
  reducer,
  prepare: (payload: string) => snapshotPrepare(payload),
};

import { snapshotPrepare } from "../../../common/redux/functions";
import { SnapshotPayloadAction } from "../../../common/redux/types";
import { createLabelingDocument } from "../../functions";
import { ExternalDocument } from "../../types/database";
import { WorkspaceState } from "../state";

export function reducer(
  state: WorkspaceState,
  action: SnapshotPayloadAction<ExternalDocument>,
): WorkspaceState {
  const { payload: initial } = action;
  const data = createLabelingDocument(initial);

  return {
    ...state,
    history: [{ id: action.meta.snapshotId, data, message: "LabelingLoaded" }],
    index: 0,
    initial,
  };
}

export default {
  reducer,
  prepare: (payload: ExternalDocument) => snapshotPrepare(payload),
};

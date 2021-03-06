import { snapshotPrepare } from "../../../common/redux/functions";
import { SnapshotPayloadAction } from "../../../common/redux/types";
import { currentDocumentSelector } from "../selectors";
import { WorkspaceState } from "../state";
import setCurrentFrameAction from "./setCurrentFrameReducer";

export interface MoveCurrentFramePayload {
  step: number;
}

export function reducer(
  state: WorkspaceState,
  action: SnapshotPayloadAction<MoveCurrentFramePayload>,
): WorkspaceState {
  const data = currentDocumentSelector.resultFunc(state);
  const { currentFrame } = data;
  const { step } = action.payload;
  const propagationStep = state.preferences.frameChangeStep;
  const nextFrame = currentFrame + Number(step) * propagationStep;

  return setCurrentFrameAction.reducer(state, {
    ...action,
    payload: { nextFrame },
  });
}

export default {
  reducer,
  prepare: (payload: MoveCurrentFramePayload) => snapshotPrepare(payload),
};

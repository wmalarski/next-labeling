import { PayloadAction } from "@reduxjs/toolkit";
import { currentDocumentSelector } from "../selectors";
import { WorkspaceState } from "../state";
import setCurrentFrameAction from "./setCurrentFrameAction";

export interface MoveCurrentFrameActionPayload {
  step: number;
}

export default function moveCurrentFrameAction(
  state: WorkspaceState,
  action: PayloadAction<MoveCurrentFrameActionPayload>,
): WorkspaceState {
  const data = currentDocumentSelector.resultFunc(state);
  const { currentFrame } = data;
  const { step } = action.payload;
  const propagationStep = state.preferences.frameChangeStep;
  const nextFrame = currentFrame + Number(step) * propagationStep;

  return setCurrentFrameAction(state, {
    ...action,
    payload: { nextFrame },
  });
}

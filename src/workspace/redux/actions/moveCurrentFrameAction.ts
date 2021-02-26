import { PayloadAction } from "@reduxjs/toolkit";
import { frameToRange } from "../../functions";
import { currentDocumentSelector } from "../selectors";
import { WorkspaceState } from "../state";
import setCurrentFrameAction from "./setCurrentFrameAction";

export interface MoveCurrentFrameActionPayload {
  step: number;
  propagationStep: number;
  duration: number;
}

export default function moveCurrentFrameAction(
  state: WorkspaceState,
  action: PayloadAction<MoveCurrentFrameActionPayload>,
): WorkspaceState {
  const data = currentDocumentSelector.resultFunc(state);
  const { currentFrame } = data;
  const { step, propagationStep, duration } = action.payload;
  const nextFrame = frameToRange(
    currentFrame + Number(step) * propagationStep,
    duration,
  );

  return setCurrentFrameAction(state, {
    ...action,
    payload: { nextFrame, propagationStep },
  });
}

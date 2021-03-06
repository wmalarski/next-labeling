import { snapshotPrepare } from "../../../common/redux/functions";
import { SnapshotPayloadAction } from "../../../common/redux/types";
import { unpackValues } from "../../../editors/functions";
import { frameToRange } from "../../functions";
import { LabelingAction } from "../../types/client";
import { addSnapshot } from "../functions";
import { currentDocumentSelector } from "../selectors";
import { WorkspaceState } from "../state";

export interface SetCurrentFramePayload {
  nextFrame: number;
}

export function reducer(
  state: WorkspaceState,
  action: SnapshotPayloadAction<SetCurrentFramePayload>,
): WorkspaceState {
  const data = currentDocumentSelector.resultFunc(state);
  const { nextFrame } = action.payload;
  const nextFrameInRange = frameToRange(Number(nextFrame), state.duration);
  const propagationStep = state.preferences.frameChangeStep;

  const { objects, currentFrame } = data;
  const changeStep = nextFrameInRange - currentFrame;
  const message = `Frame changed`;
  const actionIcon =
    changeStep < 0
      ? LabelingAction.FRAME_CHANGE_BACKWARD
      : LabelingAction.FRAME_CHANGE_FORWARD;

  if (Math.abs(changeStep) !== propagationStep)
    return addSnapshot(state, {
      id: action.meta.snapshotId,
      message,
      action: actionIcon,
      data: { ...data, currentFrame: nextFrameInRange },
    });
  const newObjects = objects.map(object => {
    if (
      !object.isTracked ||
      object.isDone ||
      !object.frames ||
      !object.frames.includes(currentFrame) ||
      object.frames.includes(nextFrameInRange)
    )
      return object;

    return {
      ...object,
      frames: [...object.frames, nextFrameInRange],
      fields: object.fields.map(field => {
        if (!field.fieldSchema.perFrame) return field;
        // TODO: vision tracking #12
        if (changeStep > 0) return field;

        // move first frame
        const unpacked = unpackValues(field.values);
        if (!unpacked) return field;
        const { type, pairs } = unpacked;
        const [firstValue, ...other] = pairs;

        return {
          ...field,
          values: {
            [type]: [
              {
                ...firstValue,
                frame: nextFrameInRange,
              },
              ...other,
            ],
          },
        };
      }),
    };
  });

  return addSnapshot(state, {
    id: action.meta.snapshotId,
    message,
    action: actionIcon,
    data: { ...data, currentFrame: nextFrameInRange, objects: newObjects },
  });
}

export default {
  reducer,
  prepare: (payload: SetCurrentFramePayload) => snapshotPrepare(payload),
};

import ArrowLeftIcon from "@material-ui/icons/ArrowLeft";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import { PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { unpackValues } from "../../../editors/functions";
import { addSnapshot } from "../functions";
import { currentDocumentSelector } from "../selectors";
import { WorkspaceState } from "../state";

export interface SetCurrentFrameActionPayload {
  nextFrame: number;
  propagationStep: number;
}

export default function setCurrentFrameAction(
  state: WorkspaceState,
  action: PayloadAction<SetCurrentFrameActionPayload>,
): WorkspaceState {
  const data = currentDocumentSelector.resultFunc(state);
  const { nextFrame, propagationStep } = action.payload;

  const { objects, currentFrame } = data;
  const changeStep = nextFrame - currentFrame;
  const message = `Frame changed`;
  const icon = changeStep < 0 ? ArrowLeftIcon : ArrowRightIcon;

  if (Math.abs(changeStep) !== propagationStep)
    return addSnapshot(state, {
      id: uuidv4(),
      message,
      icon,
      data: { ...data, currentFrame: nextFrame },
    });
  const newObjects = objects.map(object => {
    if (
      !object.isTracked ||
      object.isDone ||
      !object.frames ||
      !object.frames.includes(currentFrame) ||
      object.frames.includes(nextFrame)
    )
      return object;

    return {
      ...object,
      frames: [...object.frames, nextFrame],
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
                frame: nextFrame,
              },
              ...other,
            ],
          },
        };
      }),
    };
  });

  return addSnapshot(state, {
    id: uuidv4(),
    message,
    icon,
    data: { ...data, currentFrame: nextFrame, objects: newObjects },
  });
}

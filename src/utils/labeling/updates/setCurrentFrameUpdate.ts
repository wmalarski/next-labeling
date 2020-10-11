import ArrowLeftIcon from "@material-ui/icons/ArrowLeft";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";

import { unpackValues } from "../../editors/functions";
import { LabelingState } from "../hooks/useLabelingHistory";
import { ExtendedLabeling } from "../types";

export default function setCurrentFrameUpdate(
  data: ExtendedLabeling,
  nextFrame: number,
  propagationStep: number,
): LabelingState {
  const { objects, currentFrame } = data;
  const changeStep = nextFrame - currentFrame;
  const message = `Frame changed`;
  const icon = changeStep < 0 ? ArrowLeftIcon : ArrowRightIcon;

  if (changeStep !== propagationStep)
    return {
      message,
      icon,
      data: { ...data, currentFrame: nextFrame },
    };
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

  return {
    message,
    icon,
    data: { ...data, currentFrame: nextFrame, objects: newObjects },
  };
}

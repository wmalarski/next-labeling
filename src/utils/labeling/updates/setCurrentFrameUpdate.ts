import { ExtendedLabeling } from "../types";
import { LabelingState } from "../useLabelingHistory";

export default function setCurrentFrameUpdate(
  data: ExtendedLabeling,
  frame: number,
): LabelingState {
  return { message: "Frame changed", data: { ...data, currentFrame: frame } };
}

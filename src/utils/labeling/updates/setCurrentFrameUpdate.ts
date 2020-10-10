import { ExtendedLabeling } from "../types";

export default function setCurrentFrameUpdate(
  data: ExtendedLabeling,
  frame: number,
): ExtendedLabeling {
  return { ...data, currentFrame: frame };
}

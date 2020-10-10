import { ExtendedLabeling } from "../types";
import { LabelingState } from "../hooks/useLabelingHistory";

export default function setToggledUpdate(
  data: ExtendedLabeling,
  toggled: string[],
): LabelingState {
  return { message: "Selection changed", data: { ...data, toggled } };
}

import { ExtendedLabeling, ObjectSelection } from "../types";
import { LabelingState } from "../hooks/useLabelingHistory";

export default function setSelectedUpdate(
  data: ExtendedLabeling,
  selected: ObjectSelection[],
): LabelingState {
  return { message: "Selection changed", data: { ...data, selected } };
}

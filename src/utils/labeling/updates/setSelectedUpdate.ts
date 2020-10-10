import { ExtendedLabeling, ObjectSelection } from "../types";
import { LabelingState } from "../useLabelingHistory";

export default function setSelectedUpdate(
  data: ExtendedLabeling,
  selected: ObjectSelection[],
): LabelingState {
  return { message: "Selection changed", data: { ...data, selected } };
}

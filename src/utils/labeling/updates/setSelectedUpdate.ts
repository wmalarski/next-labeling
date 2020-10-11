import SelectAllIcon from "@material-ui/icons/SelectAll";

import { LabelingState } from "../hooks/useLabelingHistory";
import { ExtendedLabeling, ObjectSelection } from "../types";

export default function setSelectedUpdate(
  data: ExtendedLabeling,
  selected: ObjectSelection[],
): LabelingState {
  return {
    message: "Selection changed",
    icon: SelectAllIcon,
    data: { ...data, selected },
  };
}

import SelectAllIcon from "@material-ui/icons/SelectAll";

import { LabelingState } from "../hooks/useLabelingHistory";
import { LabelingDocument, ObjectSelection } from "../types/client";

export default function setSelectedUpdate(
  data: LabelingDocument,
  selected: ObjectSelection[],
): LabelingState {
  return {
    message: "Selection changed",
    icon: SelectAllIcon,
    data: { ...data, selected },
  };
}

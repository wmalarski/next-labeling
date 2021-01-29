import SelectAllIcon from "@material-ui/icons/SelectAll";

import { LabelingDocument } from "../types/client";
import { LabelingState } from "../hooks/useLabelingHistory";

export default function setToggledUpdate(
  data: LabelingDocument,
  toggled: string[],
): LabelingState {
  return {
    message: "Selection changed",
    icon: SelectAllIcon,
    data: { ...data, toggled },
  };
}

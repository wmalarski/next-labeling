import SelectAllIcon from "@material-ui/icons/SelectAll";

import { ExtendedLabeling } from "../types";
import { LabelingState } from "../hooks/useLabelingHistory";

export default function setToggledUpdate(
  data: ExtendedLabeling,
  toggled: string[],
): LabelingState {
  return {
    message: "Selection changed",
    icon: SelectAllIcon,
    data: { ...data, toggled },
  };
}

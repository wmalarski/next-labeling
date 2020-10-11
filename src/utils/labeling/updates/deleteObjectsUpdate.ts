import HighlightOffIcon from "@material-ui/icons/HighlightOff";

import { ExtendedLabeling } from "../types";
import { LabelingState } from "../hooks/useLabelingHistory";

export default function deleteObjectsUpdate(
  data: ExtendedLabeling,
): LabelingState {
  const ids = data.selected
    .filter(object => object.objectSelected)
    .map(object => object.objectId);
  return {
    message: "Objects removed",
    icon: HighlightOffIcon,
    data: {
      ...data,
      objects: data.objects.filter(object => !ids.includes(object.id)),
    },
  };
}

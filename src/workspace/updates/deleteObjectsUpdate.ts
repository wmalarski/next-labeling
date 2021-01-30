import HighlightOffIcon from "@material-ui/icons/HighlightOff";

import { LabelingDocument } from "../types/client";
import { LabelingState } from "../hooks/useLabelingHistory";

export default function deleteObjectsUpdate(
  data: LabelingDocument,
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

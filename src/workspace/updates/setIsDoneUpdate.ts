import CheckCircleIcon from "@material-ui/icons/CheckCircle";

import { LabelingState } from "../hooks/useLabelingHistory";
import { LabelingDocument, LabelingObject } from "../types/client";

export default function setIsDoneUpdate(
  data: LabelingDocument,
  object: LabelingObject,
  checked: boolean,
): LabelingState {
  const objectIndex = data.objects.findIndex(obj => obj.id === object.id);
  const objects = [...data.objects];
  objects[objectIndex] = { ...objects[objectIndex], isDone: checked };
  return {
    message: `Done value changed to ${checked}`,
    icon: CheckCircleIcon,
    data: { ...data, objects },
  };
}

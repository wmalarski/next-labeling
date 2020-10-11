import CheckCircleIcon from "@material-ui/icons/CheckCircle";

import { LabelingState } from "../hooks/useLabelingHistory";
import { ExtendedLabeling, ExtendedObject } from "../types";

export default function setIsDoneUpdate(
  data: ExtendedLabeling,
  object: ExtendedObject,
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

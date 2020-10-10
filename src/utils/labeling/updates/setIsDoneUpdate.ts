import { ExtendedLabeling, ExtendedObject } from "../types";
import { LabelingState } from "../useLabelingHistory";

export default function setIsDoneUpdate(
  data: ExtendedLabeling,
  object: ExtendedObject,
  checked: boolean,
): LabelingState {
  const objectIndex = data.objects.findIndex(obj => obj.id === object.id);
  const objects = [...data.objects];
  objects[objectIndex] = { ...objects[objectIndex], isDone: checked };
  return { message: "Done value changed", data: { ...data, objects } };
}

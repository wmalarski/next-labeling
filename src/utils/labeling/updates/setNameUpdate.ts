import { ExtendedLabeling, ExtendedObject } from "../types";
import { LabelingState } from "../hooks/useLabelingHistory";

export default function setNameUpdate(
  data: ExtendedLabeling,
  object: ExtendedObject,
  name: string,
): LabelingState {
  const objectIndex = data.objects.findIndex(obj => obj.id === object.id);
  const objects = [...data.objects];
  objects[objectIndex] = { ...objects[objectIndex], name };
  return { message: "Name changed", data: { ...data, objects } };
}

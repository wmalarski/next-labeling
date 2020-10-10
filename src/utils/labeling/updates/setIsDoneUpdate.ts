import { ExtendedLabeling, ExtendedObject } from "../types";

export default function setIsDoneUpdate(
  data: ExtendedLabeling,
  object: ExtendedObject,
  checked: boolean,
): ExtendedLabeling {
  const objectIndex = data.objects.findIndex(obj => obj.id === object.id);
  const objects = [...data.objects];
  objects[objectIndex] = { ...object, isDone: checked };
  return { ...data, objects };
}

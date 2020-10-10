import { ExtendedLabeling, ExtendedObject } from "../types";

export default function setIsTrackedUpdate(
  data: ExtendedLabeling,
  object: ExtendedObject,
  checked: boolean,
): ExtendedLabeling {
  const objectIndex = data.objects.findIndex(obj => obj.id === object.id);
  const objects = [...data.objects];
  objects[objectIndex] = { ...object, isTracked: checked };
  return { ...data, objects };
}

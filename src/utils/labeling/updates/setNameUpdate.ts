import { ExtendedLabeling, ExtendedObject } from "../types";

export default function setNameUpdate(
  data: ExtendedLabeling,
  object: ExtendedObject,
  name: string,
): ExtendedLabeling {
  const objectIndex = data.objects.findIndex(obj => obj.id === object.id);
  const objects = [...data.objects];
  objects[objectIndex] = { ...object, name };
  return { ...data, objects };
}

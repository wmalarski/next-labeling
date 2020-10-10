import { ExtendedLabeling } from "../types";

export default function deleteObjectsUpdate(
  data: ExtendedLabeling,
  ids: string[],
): ExtendedLabeling {
  return {
    ...data,
    objects: data.objects.filter(object => !ids.includes(object.id)),
  };
}

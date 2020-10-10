import { ExtendedLabeling } from "../types";
import { LabelingState } from "../hooks/useLabelingHistory";

export default function deleteObjectsUpdate(
  data: ExtendedLabeling,
  ids: string[],
): LabelingState {
  return {
    message: "Objects removed",
    data: {
      ...data,
      objects: data.objects.filter(object => !ids.includes(object.id)),
    },
  };
}

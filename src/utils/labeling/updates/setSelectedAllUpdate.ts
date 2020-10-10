import { ExtendedLabeling } from "../types";
import { LabelingState } from "../hooks/useLabelingHistory";

export default function setSelectedAllUpdate(
  data: ExtendedLabeling,
): LabelingState {
  return {
    message: "Selection changed",
    data: {
      ...data,
      selected: data.objects.map(object => ({
        fieldIds: object.fields.map(field => field.id),
        objectId: object.id,
        objectSelected: true,
        singleton: object.objectSchema.singleton,
      })),
    },
  };
}

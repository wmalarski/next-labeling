import SelectAllIcon from "@material-ui/icons/SelectAll";

import { LabelingState } from "../hooks/useLabelingHistory";
import { LabelingDocument } from "../types/client";

export default function setSelectedAllUpdate(
  data: LabelingDocument,
): LabelingState {
  return {
    message: "Selection changed",
    icon: SelectAllIcon,
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

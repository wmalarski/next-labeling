import SelectAllIcon from "@material-ui/icons/SelectAll";

import { LabelingState } from "../hooks/useLabelingHistory";
import { LabelingDocument } from "../types/client";

export default function setSelectedObjectUpdate(
  data: LabelingDocument,
  selectedId: string | null,
): LabelingState {
  return {
    message: "Selection changed",
    icon: SelectAllIcon,
    data: {
      ...data,
      selected: !selectedId
        ? []
        : [
            {
              fieldIds: [],
              objectId: selectedId,
              objectSelected: true,
              singleton:
                data.objects.find(object => object.id === selectedId)
                  ?.objectSchema.singleton ?? true,
            },
          ],
    },
  };
}

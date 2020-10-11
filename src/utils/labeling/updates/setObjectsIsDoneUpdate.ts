import CheckCircleIcon from "@material-ui/icons/CheckCircle";

import { LabelingDocument } from "../types/client";
import { LabelingState } from "../hooks/useLabelingHistory";

export default function setObjectsIsDoneUpdate(
  data: LabelingDocument,
): LabelingState {
  const objects = data.selected.filter(object => object.objectSelected);
  const firstId = objects[0]?.objectId;
  const firstObject = data.objects.find(object => object.id === firstId);
  const firstIsDone = firstObject?.isDone;

  const ids = objects.map(object => object.objectId);
  return {
    message: "Objects Done toggled",
    icon: CheckCircleIcon,
    data: {
      ...data,
      objects: data.objects.map(object =>
        !ids.includes(object.id)
          ? object
          : {
              ...object,
              isDone: !firstIsDone,
            },
      ),
    },
  };
}

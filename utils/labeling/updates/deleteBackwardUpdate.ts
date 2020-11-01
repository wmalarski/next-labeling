import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import compact from "lodash/compact";
import { deleteObjectBackward } from "../functions";
import { LabelingState } from "../hooks/useLabelingHistory";
import { LabelingDocument } from "../types/client";

export default function deleteBackwardUpdate(
  data: LabelingDocument,
): LabelingState {
  const currentFrame = data.currentFrame;
  const ids = data.selected
    .filter(object => object.objectSelected)
    .map(object => object.objectId);
  return {
    message: "Objects deleted forward",
    icon: ArrowBackIcon,
    data: {
      ...data,
      objects: compact(
        data.objects.map(object =>
          !ids.includes(object.id)
            ? object
            : deleteObjectBackward(object, currentFrame),
        ),
      ),
    },
  };
}

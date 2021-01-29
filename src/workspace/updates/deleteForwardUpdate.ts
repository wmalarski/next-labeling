import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import compact from "lodash/compact";
import { deleteObjectForward } from "../functions";
import { LabelingState } from "../hooks/useLabelingHistory";
import { LabelingDocument } from "../types/client";

export default function deleteForwardUpdate(
  data: LabelingDocument,
): LabelingState {
  const currentFrame = data.currentFrame;
  const ids = data.selected
    .filter(object => object.objectSelected)
    .map(object => object.objectId);
  return {
    message: "Objects deleted forward",
    icon: ArrowForwardIcon,
    data: {
      ...data,
      objects: compact(
        data.objects.map(object =>
          !ids.includes(object.id)
            ? object
            : deleteObjectForward(object, currentFrame),
        ),
      ),
    },
  };
}

import AddBoxIcon from "@material-ui/icons/AddBox";
import compact from "lodash/compact";
import {
  copyObject,
  deleteObjectBackward,
  deleteObjectForward,
} from "../functions";
import { LabelingState } from "../hooks/useLabelingHistory";
import { LabelingDocument } from "../types/client";

export default function addObjectSplitUpdate(
  data: LabelingDocument,
): LabelingState {
  const { currentFrame } = data;
  const ids = data.selected
    .filter(object => object.objectSelected)
    .map(object => object.objectId);
  return {
    message: "Objects splited",
    icon: AddBoxIcon,
    data: {
      ...data,
      objects: data.objects.flatMap(object => {
        if (!ids.includes(object.id)) return [object];
        return compact([
          deleteObjectForward(object, currentFrame),
          deleteObjectBackward(copyObject(object), currentFrame),
        ]);
      }),
    },
  };
}

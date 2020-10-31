import FileCopyIcon from "@material-ui/icons/FileCopy";
import { copyObject } from "../functions";
import { LabelingState } from "../hooks/useLabelingHistory";
import { LabelingDocument } from "../types/client";

export default function addObjectCopyUpdate(
  data: LabelingDocument,
  ids: string[],
): LabelingState {
  return {
    message: "Objects copied",
    icon: FileCopyIcon,
    data: {
      ...data,
      objects: [
        ...data.objects,
        ...data.objects
          .filter(object => ids.includes(object.id))
          .map(object => copyObject(object)),
      ],
    },
  };
}

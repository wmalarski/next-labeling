import { LabelingDocument, LabelingObject } from "../types/client";
import { LabelingState } from "../hooks/useLabelingHistory";
import ImageSearchIcon from "@material-ui/icons/ImageSearch";

export default function setIsTrackedUpdate(
  data: LabelingDocument,
  object: LabelingObject,
  checked: boolean,
): LabelingState {
  const objectIndex = data.objects.findIndex(obj => obj.id === object.id);
  const objects = [...data.objects];
  objects[objectIndex] = { ...objects[objectIndex], isTracked: checked };
  return {
    message: `Tracked value changed to ${checked}`,
    icon: ImageSearchIcon,
    data: { ...data, objects },
  };
}

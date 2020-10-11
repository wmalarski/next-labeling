import EditIcon from "@material-ui/icons/Edit";

import { LabelingState } from "../hooks/useLabelingHistory";
import { ExtendedLabeling, ExtendedObject } from "../types";

export default function setNameUpdate(
  data: ExtendedLabeling,
  object: ExtendedObject,
  name: string,
): LabelingState {
  const objectIndex = data.objects.findIndex(obj => obj.id === object.id);
  const objects = [...data.objects];
  objects[objectIndex] = { ...objects[objectIndex], name };
  return {
    message: `Name '${object.name}' changed to '${name}'`,
    icon: EditIcon,
    data: { ...data, objects },
  };
}

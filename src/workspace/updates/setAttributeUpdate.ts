import EditIcon from "@material-ui/icons/Edit";

import { LabelingFieldValues } from "../../editors/types";
import { LabelingState } from "../hooks/useLabelingHistory";
import { LabelingDocument } from "../types/client";

export default function setAttributeUpdate(
  data: LabelingDocument,
  objectId: string,
  fieldId: string,
  values: LabelingFieldValues,
): LabelingState {
  const objectIndex = data.objects.findIndex(obj => obj.id === objectId);
  const objects = [...data.objects];
  const object = objects[objectIndex];
  const fieldIndex = object.fields.findIndex(f => f.id === fieldId);
  const fields = [...object.fields];
  const field = fields[fieldIndex];

  fields[fieldIndex] = { ...field, values };
  objects[objectIndex] = { ...object, fields };
  return {
    message: `Attribute ${field.fieldSchema.name} changed`,
    icon: EditIcon,
    data: { ...data, objects },
  };
}

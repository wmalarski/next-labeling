import { LabelingFieldValues } from "../../editors/types";
import { ExtendedLabeling } from "../types";

export default function setAttributeUpdate(
  data: ExtendedLabeling,
  objectId: string,
  fieldId: string,
  values: LabelingFieldValues,
): ExtendedLabeling {
  const objectIndex = data.objects.findIndex(obj => obj.id === objectId);
  const objects = [...data.objects];
  const object = objects[objectIndex];
  const fieldIndex = object.fields.findIndex(f => f.id === fieldId);
  const fields = [...object.fields];

  fields[fieldIndex] = { ...fields[fieldIndex], values };
  objects[objectIndex] = { ...object, fields };
  return { ...data, objects };
}

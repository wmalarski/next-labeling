import { createObject } from "./functions";
import { ExtendedField, ExtendedLabeling, ExtendedObject } from "./types";
import { ObjectSchema } from "../schema/types";
import { LabelingFieldValues } from "../editors/types";

export function addObjectUpdate(
  data: ExtendedLabeling,
  objectSchema: ObjectSchema,
  currentFrame: number,
): ExtendedLabeling {
  return {
    ...data,
    objects: [...data.objects, createObject(objectSchema, currentFrame)],
  };
}

export function changeAttributeUpdate(
  data: ExtendedLabeling,
  object: ExtendedObject,
  field: ExtendedField,
  values: LabelingFieldValues,
): ExtendedLabeling {
  const fieldIndex = object.fields.findIndex(f => f.id === field.id);
  const fields = [...object.fields];
  fields[fieldIndex] = { ...field, values };

  const objectIndex = data.objects.findIndex(obj => obj.id === object.id);
  const objects = [...data.objects];
  objects[objectIndex] = { ...object, fields };

  return { objects };
}

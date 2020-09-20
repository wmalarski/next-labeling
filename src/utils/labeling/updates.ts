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

export function changeIsDoneUpdate(
  data: ExtendedLabeling,
  object: ExtendedObject,
  checked: boolean,
): ExtendedLabeling {
  const objectIndex = data.objects.findIndex(obj => obj.id === object.id);
  const objects = [...data.objects];
  objects[objectIndex] = { ...object, isDone: checked };
  return { objects };
}

export function changeisTrackedUpdate(
  data: ExtendedLabeling,
  object: ExtendedObject,
  checked: boolean,
): ExtendedLabeling {
  const objectIndex = data.objects.findIndex(obj => obj.id === object.id);
  const objects = [...data.objects];
  objects[objectIndex] = { ...object, isTracked: checked };
  return { objects };
}

export function trackObjectsUpdate(
  data: ExtendedLabeling,
  currentFrame: number,
  changeValue: number,
): ExtendedLabeling {
  const nextFrame = currentFrame + changeValue;
  const objects = data.objects.map(object => {
    if (
      !object.isTracked ||
      object.isDone ||
      !object.frames ||
      !object.frames.includes(currentFrame) ||
      object.frames.includes(nextFrame)
    )
      return object;

    return {
      ...object,
      frames: [...object.frames, nextFrame],
      fields: object.fields.map(field => {
        if (!field.fieldSchema.perFrame) return field;
        // TODO: vision tracking
        if (changeValue === 1) return field;

        // move first frame
        const entry = Object.entries(field.values)[0];
        const [key, values] = entry;
        if (!values) return field;
        const [firstValue, ...other] = values;

        return {
          ...field,
          values: {
            [key]: [
              {
                ...firstValue,
                frame: nextFrame,
              },
              ...other,
            ],
          },
        };
      }),
    };
  });

  return { objects };
}

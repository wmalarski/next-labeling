import { v4 as uuidv4 } from "uuid";

import { createObject } from "./functions";
import { ExtendedField, ExtendedLabeling, ExtendedObject } from "./types";
import { ObjectSchema } from "../schema/types";
import { FieldValue, LabelingFieldValues } from "../editors/types";

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

export function changeIsTrackedUpdate(
  data: ExtendedLabeling,
  object: ExtendedObject,
  checked: boolean,
): ExtendedLabeling {
  const objectIndex = data.objects.findIndex(obj => obj.id === object.id);
  const objects = [...data.objects];
  objects[objectIndex] = { ...object, isTracked: checked };
  return { objects };
}

export function changeNameUpdate(
  data: ExtendedLabeling,
  object: ExtendedObject,
  name: string,
): ExtendedLabeling {
  const objectIndex = data.objects.findIndex(obj => obj.id === object.id);
  const objects = [...data.objects];
  objects[objectIndex] = { ...object, name };
  return { objects };
}

export function trackObjectsUpdate(
  data: ExtendedLabeling,
  currentFrame: number,
  changeValue: number,
): ExtendedLabeling {
  const nextFrame = currentFrame + changeValue;
  // TODO: return idexes of items that was tracked #1
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
        // TODO: vision tracking #12
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

export function removeObjectsUpdate(
  data: ExtendedLabeling,
  ids: string[],
): ExtendedLabeling {
  return {
    objects: data.objects.filter(object => !ids.includes(object.id)),
  };
}

export function copyObjectsUpdate(
  data: ExtendedLabeling,
  ids: string[],
): ExtendedLabeling {
  return {
    objects: [
      ...data.objects,
      ...data.objects
        .filter(object => ids.includes(object.id))
        .map(object => ({
          ...object,
          id: uuidv4(),
          name: `${object.name} - Copy`,
          fields: object.fields.map(field => ({
            ...field,
            id: uuidv4(),
          })),
        })),
    ],
  };
}

export function deleteForwardUpdate(
  data: ExtendedLabeling,
  ids: string[],
  currentFrame: number,
): ExtendedLabeling {
  return {
    objects: data.objects.flatMap(object => {
      if (!ids.includes(object.id)) return [object];

      const frames =
        object.frames?.filter(frame => frame <= currentFrame) ?? null;
      if (frames?.length === 0) return [];

      return [
        {
          ...object,
          frames,
          fields: object.fields.map(field => {
            const entry = Object.entries(field.values)[0];
            const [key, values]: [
              string,
              FieldValue<any>[] | undefined,
            ] = entry;
            if (!values) return field;
            return {
              ...field,
              values: {
                [key]: values.filter(value => value.frame <= currentFrame),
              },
            };
          }),
        },
      ];
    }),
  };
}

export function deleteBackwardUpdate(
  data: ExtendedLabeling,
  ids: string[],
  currentFrame: number,
): ExtendedLabeling {
  return {
    objects: data.objects.flatMap(object => {
      if (!ids.includes(object.id)) return [object];

      const frames =
        object.frames?.filter(frame => frame >= currentFrame) ?? null;
      if (frames?.length === 0) return [];

      return [
        {
          ...object,
          frames,
          fields: object.fields.map(field => {
            const entry = Object.entries(field.values)[0];
            const [key, values] = entry;
            if (!values) return field;

            const newValues: FieldValue<any>[] = [...values];
            const lower = newValues.filter(value => value.frame < currentFrame);
            newValues.splice(0, lower.length);

            const firstGreater = newValues[0];
            if (
              (firstGreater && firstGreater.frame !== currentFrame) ||
              !firstGreater
            ) {
              newValues.splice(0, 0, {
                frame: currentFrame,
                value: lower[lower.length - 1].value,
              });
            }
            return {
              ...field,
              values: { [key]: newValues },
            };
          }),
        },
      ];
    }),
  };
}

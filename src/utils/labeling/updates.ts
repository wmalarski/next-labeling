import { v4 as uuidv4 } from "uuid";

import { createObject } from "./functions";
import {
  ExtendedField,
  ExtendedLabeling,
  ExtendedObject,
  ObjectSelection,
} from "./types";
import { ObjectSchema } from "../schema/types";
import { FieldValue, LabelingFieldValues } from "../editors/types";

export function addObjectUpdate(
  data: ExtendedLabeling,
  objectSchema: ObjectSchema,
  currentFrame: number,
): [ExtendedObject, ExtendedLabeling] {
  const object = createObject(objectSchema, currentFrame);
  return [
    object,
    {
      ...data,
      objects: [...data.objects, object],
      selected: [
        {
          fieldIds: [],
          objectId: object.id,
          objectSelected: true,
          singleton: objectSchema.singleton,
        },
      ],
    },
  ];
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
  return { ...data, objects };
}

export function changeIsDoneUpdate(
  data: ExtendedLabeling,
  object: ExtendedObject,
  checked: boolean,
): ExtendedLabeling {
  const objectIndex = data.objects.findIndex(obj => obj.id === object.id);
  const objects = [...data.objects];
  objects[objectIndex] = { ...object, isDone: checked };
  return { ...data, objects };
}

export function changeIsTrackedUpdate(
  data: ExtendedLabeling,
  object: ExtendedObject,
  checked: boolean,
): ExtendedLabeling {
  const objectIndex = data.objects.findIndex(obj => obj.id === object.id);
  const objects = [...data.objects];
  objects[objectIndex] = { ...object, isTracked: checked };
  return { ...data, objects };
}

export function changeNameUpdate(
  data: ExtendedLabeling,
  object: ExtendedObject,
  name: string,
): ExtendedLabeling {
  const objectIndex = data.objects.findIndex(obj => obj.id === object.id);
  const objects = [...data.objects];
  objects[objectIndex] = { ...object, name };
  return { ...data, objects };
}

export function trackObjectsUpdate(
  data: ExtendedLabeling,
  currentFrame: number,
  changeValue: number,
): { result: ExtendedLabeling; tracked: boolean } {
  const nextFrame = currentFrame + changeValue;
  // TODO: return idexes of items that was tracked #1
  const pairs = data.objects.map(object => {
    if (
      !object.isTracked ||
      object.isDone ||
      !object.frames ||
      !object.frames.includes(currentFrame) ||
      object.frames.includes(nextFrame)
    )
      return { object, tracked: false };

    return {
      object: {
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
      },
      tracked: true,
    };
  });

  return {
    result: { ...data, objects: pairs.map(pair => pair.object) },
    tracked: pairs.filter(pair => pair.tracked).length > 0,
  };
}

export function removeObjectsUpdate(
  data: ExtendedLabeling,
  ids: string[],
): ExtendedLabeling {
  return {
    ...data,
    objects: data.objects.filter(object => !ids.includes(object.id)),
  };
}

export function copyObjectsUpdate(
  data: ExtendedLabeling,
  ids: string[],
): ExtendedLabeling {
  return {
    ...data,
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
    ...data,
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
    ...data,
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

export function setSelectedUpdate(
  data: ExtendedLabeling,
  selected: ObjectSelection[],
): ExtendedLabeling {
  return { ...data, selected };
}

export function setToggledUpdate(
  data: ExtendedLabeling,
  toggled: string[],
): ExtendedLabeling {
  return { ...data, toggled };
}

export function setCurrentFrameUpdate(
  data: ExtendedLabeling,
  frame: number,
): ExtendedLabeling {
  return { ...data, currentFrame: frame };
}

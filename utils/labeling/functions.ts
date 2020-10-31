import compact from "lodash/compact";
import uniqueId from "lodash/uniqueId";
import { v4 as uuidv4 } from "uuid";
import { unpackValues } from "../editors/functions";
import { ObjectSchema, Schema } from "../schema/types";
import {
  IsDoneFilterValue,
  LabelingDisplayFilters,
  LabelingDocument,
  LabelingField,
  LabelingObject,
} from "./types/client";
import { ExternalDocument, ExternalObject } from "./types/database";

export function createObject(
  objectSchema: ObjectSchema,
  currentFrame: number,
): LabelingObject {
  return {
    id: uuidv4(),
    isTracked: true,
    name: uniqueId(`${objectSchema.name} `),
    isDone: false,
    objectSchemaId: objectSchema.id,
    objectSchema: objectSchema,
    frames: objectSchema.singleton ? null : [currentFrame],
    fields: objectSchema.fields.map(fieldSchema => {
      const [key, value] = Object.entries(fieldSchema.attributes)[0];
      return {
        id: uuidv4(),
        fieldSchemaId: fieldSchema.id,
        fieldSchema: fieldSchema,
        values: { [key]: [{ frame: currentFrame, value: value?.default }] },
      };
    }),
  };
}

export function copyObject(
  object: LabelingObject,
  suffix?: string,
): LabelingObject {
  const copy = JSON.parse(JSON.stringify(object)) as LabelingObject;
  return {
    ...copy,
    id: uuidv4(),
    name: `${object.name}${suffix ?? " - Copy"}`,
    fields: object.fields.map(field => ({
      ...field,
      id: uuidv4(),
    })),
  };
}

export function deleteObjectBackward(
  object: LabelingObject,
  currentFrame: number,
): LabelingObject | null {
  const frames = object.frames?.filter(frame => frame >= currentFrame) ?? null;
  if (frames?.length === 0) return null;

  return {
    ...object,
    frames,
    fields: object.fields.map(field => {
      const unpacked = unpackValues(field.values);
      if (!unpacked) return field;

      const newValues = [...unpacked.pairs];
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
        values: { [unpacked.type]: newValues },
      };
    }),
  };
}

export function deleteObjectForward(
  object: LabelingObject,
  currentFrame: number,
): LabelingObject | null {
  const frames = object.frames?.filter(frame => frame <= currentFrame) ?? null;
  if (frames?.length === 0) return null;

  return {
    ...object,
    frames,
    fields: object.fields.map(field => {
      const unpacked = unpackValues(field.values);
      if (!unpacked) return field;
      const { type, pairs } = unpacked;
      return {
        ...field,
        values: {
          [type]: pairs.filter(value => value.frame <= currentFrame),
        },
      };
    }),
  };
}

export function groupObjectsBySchema(
  objects: ExternalObject[],
): { [definition: string]: ExternalObject[] } {
  return objects.reduce<{ [definition: string]: ExternalObject[] }>(
    (prev, curr) => ({
      ...prev,
      [curr.objectSchemaId]: [...(prev[curr.objectSchemaId] ?? []), curr],
    }),
    {},
  );
}

export function pairObjectsToSchema(
  objects: ExternalObject[],
  schema: Schema,
): { object: ExternalObject; objectSchema: ObjectSchema }[] {
  return Object.entries(groupObjectsBySchema(objects)).flatMap(
    ([objectSchemaId, schemaObjects]) => {
      const objectSchema = schema.objects.find(
        sch => sch.id === objectSchemaId,
      );
      if (!objectSchema) return [];
      return schemaObjects.map(object => ({ object, objectSchema }));
    },
  );
}

export function createLabelingObjects(
  objects: ExternalObject[],
  schema: Schema,
): LabelingObject[] {
  return pairObjectsToSchema(objects, schema).map(
    ({ object, objectSchema }) => {
      const fields = object.fields.flatMap(field => {
        const fieldSchema = objectSchema.fields.find(
          f => f.id === field.fieldSchemaId,
        );
        return !fieldSchema ? [] : [{ ...field, fieldSchema }];
      });
      return {
        ...object,
        fields,
        objectSchema,
      };
    },
  );
}

export function createLabelingDocument(
  document: ExternalDocument,
): LabelingDocument {
  return {
    objects: createLabelingObjects(document.objects, document.schema),
    currentFrame: 0,
    selected: [],
    toggled: [],
  };
}

export function pairObjectsToIds(
  data: LabelingDocument,
  ids: string[],
): LabelingObject[] {
  return ids.flatMap(objectId => {
    const object = data.objects.find(object => object.id === objectId);
    return object ? [object] : [];
  });
}

export function getFrames(data: LabelingDocument, ids: string[]): number[] {
  return pairObjectsToIds(data, ids).flatMap(object => object.frames ?? []);
}

export function getFirstFrame(
  data: LabelingDocument,
  ids: string[],
): number | undefined {
  const frames = getFrames(data, ids);
  if (frames.length === 0) return undefined;
  return Math.min(...frames);
}

export function getLastFrame(
  data: LabelingDocument,
  ids: string[],
): number | undefined {
  const frames = getFrames(data, ids);
  if (frames.length === 0) return undefined;
  return Math.max(...frames);
}

export function frameToRange(frame: number, duration: number): number {
  return Math.max(Math.min(frame, duration), 0);
}

export function applyLabelingFilters(
  objects: LabelingObject[],
  filters: LabelingDisplayFilters,
): LabelingObject[] {
  const { objectSchemaIds, name, isDone } = filters;
  return objects
    .filter(object => objectSchemaIds.includes(object.objectSchemaId))
    .filter(object => (name ? object.name.includes(name) : true))
    .filter(object => {
      if (isDone === IsDoneFilterValue.ALL) return true;
      if (isDone === IsDoneFilterValue.IS_DONE && object.isDone) return true;
      if (isDone === IsDoneFilterValue.WIP && !object.isDone) return true;
      return false;
    });
}

export function labelingFilter(
  filters: LabelingDisplayFilters,
): (filter: LabelingObject) => boolean {
  const { objectSchemaIds, name, isDone } = filters;
  return object =>
    objectSchemaIds.includes(object.objectSchemaId) &&
    (name ? object.name.includes(name) : true) &&
    (isDone === IsDoneFilterValue.ALL ||
      (isDone === IsDoneFilterValue.IS_DONE && object.isDone) ||
      (isDone === IsDoneFilterValue.WIP && !object.isDone));
}
export function inFrameFilter(
  currentFrame: number,
): (object: LabelingObject) => boolean {
  return object => object.frames?.includes(currentFrame) ?? true;
}

export interface FilterFieldsResultPair {
  object: LabelingObject;
  fields: LabelingField[];
}

export function filterSelectedFields(
  data: LabelingDocument,
): FilterFieldsResultPair[] {
  const { selected, objects, currentFrame } = data;
  return compact(
    selected.map(selection => {
      const object = objects.find(object => object.id === selection.objectId);
      if (!object) return null;
      const isInFrame = object.frames?.includes(currentFrame) ?? true;
      return {
        object,
        fields: (selection.objectSelected
          ? object.fields
          : compact(
              selection.fieldIds.map(fieldId =>
                object.fields.find(f => f.id === fieldId),
              ),
            )
        ).filter(field => !field.fieldSchema.perFrame || isInFrame),
      };
    }),
  );
}

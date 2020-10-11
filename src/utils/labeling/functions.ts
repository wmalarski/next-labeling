import uniqueId from "lodash/uniqueId";
import { v4 as uuidv4 } from "uuid";

import { ObjectSchema, Schema } from "../schema/types";
import {
  IsDoneFilterValue,
  LabelingDisplayFilters,
  LabelingDocument,
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

export function createLabelingDocument(
  document: ExternalDocument,
): LabelingDocument {
  return {
    currentFrame: 0,
    selected: [],
    toggled: [],
    objects: pairObjectsToSchema(document.objects, document.schema).map(
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
    ),
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

import { v4 as uuidv4 } from "uuid";
import { FieldSchema, ObjectSchema, Schema } from "../schema/types";
import { LabelingField, LabelingObject } from "./types";

export function createObject(
  objectSchema: ObjectSchema,
  currentFrame: number,
): LabelingObject {
  return {
    comments: [],
    frames: [currentFrame],
    id: uuidv4(),
    isTracked: false,
    name: objectSchema.name,
    isDone: false,
    singleton: objectSchema.singleton,
    schemaObjectId: objectSchema.id,
    fields: objectSchema.fields.map(fieldSchema => {
      const [key, value] = Object.entries(fieldSchema.attributes)[0];
      return {
        id: uuidv4(),
        schemaFieldId: fieldSchema.id,
        values: { [key]: [{ frame: currentFrame, value: value?.default }] },
      };
    }),
  };
}

export function groupObjectsBySchema(
  objects: LabelingObject[],
): { [definition: string]: LabelingObject[] } {
  return objects.reduce<{ [definition: string]: LabelingObject[] }>(
    (prev, curr) => ({
      ...prev,
      [curr.schemaObjectId]: [...(prev[curr.schemaObjectId] ?? []), curr],
    }),
    {},
  );
}

export function pairObjectsToSchema(
  objects: LabelingObject[],
  schema: Schema,
): { object: LabelingObject; objectSchema: ObjectSchema }[] {
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

export interface ObjectBlock {
  firstFrame: number;
  lastFrame: number;
}

export function calculateObjectBlocks(
  object: LabelingObject,
  duration: number,
): ObjectBlock[] {
  if (object.singleton) {
    return [{ firstFrame: 0, lastFrame: duration }];
  }
  const [first, ...frames] = object.frames;
  return frames
    .reduce(
      (prev, curr, index, array) => {
        const next = array[index + 1];
        if (!next) return [...prev, curr];
        return curr + 1 === next ? prev : [...prev, curr, next];
      },
      [first],
    )
    .reduce<ObjectBlock[]>((prev, current, index, array) => {
      return index % 2 === 0
        ? [...prev, { firstFrame: current, lastFrame: array[index + 1] }]
        : prev;
    }, []);
}

export interface ValueBlock {
  frame: number;
  value?: string;
  index: number;
}

export function calculateFieldBlocks(
  field: LabelingField,
  fieldSchema: FieldSchema,
  duration: number,
  frames: number[],
  isSingleton: boolean,
): ValueBlock[] {
  const entry = Object.entries(field.values)[0];
  if (!entry) return [];
  const [type, values] = entry;

  // if (isSingleton) {
  //   (values ?? []).map(pair => )
  // }
  return [];
}

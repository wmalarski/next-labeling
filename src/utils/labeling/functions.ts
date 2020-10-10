import { v4 as uuidv4 } from "uuid";
import uniqueId from "lodash/uniqueId";
import getValueIndex from "../editors/indexes";

import { FieldType, FieldValue } from "../editors/types";
import { ObjectSchema, Schema } from "../schema/types";
import {
  ExtendedField,
  ExtendedLabeling,
  ExtendedObject,
  LabelingDocument,
  LabelingObject,
} from "./types";

export function createObject(
  objectSchema: ObjectSchema,
  currentFrame: number,
): ExtendedObject {
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
  objects: LabelingObject[],
): { [definition: string]: LabelingObject[] } {
  return objects.reduce<{ [definition: string]: LabelingObject[] }>(
    (prev, curr) => ({
      ...prev,
      [curr.objectSchemaId]: [...(prev[curr.objectSchemaId] ?? []), curr],
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

export function createExtendedLabeling(
  document: LabelingDocument,
): ExtendedLabeling {
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
  data: ExtendedLabeling,
  ids: string[],
): ExtendedObject[] {
  return ids.flatMap(objectId => {
    const object = data.objects.find(object => object.id === objectId);
    return object ? [object] : [];
  });
}

export function getFrames(data: ExtendedLabeling, ids: string[]): number[] {
  return pairObjectsToIds(data, ids).flatMap(object => object.frames ?? []);
}

export function getFirstFrame(
  data: ExtendedLabeling,
  ids: string[],
): number | undefined {
  const frames = getFrames(data, ids);
  if (frames.length === 0) return undefined;
  return Math.min(...frames);
}

export function getLastFrame(
  data: ExtendedLabeling,
  ids: string[],
): number | undefined {
  const frames = getFrames(data, ids);
  if (frames.length === 0) return undefined;
  return Math.max(...frames);
}

export function frameToRange(frame: number, duration: number): number {
  return Math.max(Math.min(frame, duration), 0);
}

export interface ObjectBlock {
  firstFrame: number;
  lastFrame: number;
}

export function calculateObjectBlocks(
  object: ExtendedObject,
  duration: number,
): ObjectBlock[] {
  if (object.objectSchema.singleton || !object.frames) {
    return [{ firstFrame: 0, lastFrame: duration }];
  }

  const [first, ...frames] = object.frames.sort((a, b) => a - b);
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
        ? [
            ...prev,
            { firstFrame: current, lastFrame: array[index + 1] ?? current },
          ]
        : prev;
    }, []);
}

export interface FieldBlock {
  firstFrame: number;
  lastFrame: number;
  value: string;
  index: number;
}

interface ReduceFieldBlocksState {
  fieldBlocks: FieldBlock[];
  objectBlocks: ObjectBlock[];
}

export function calculateFieldBlocks(
  field: ExtendedField,
  objectBlocks: ObjectBlock[],
  duration: number,
): FieldBlock[] {
  const [type, values]: [
    string,
    FieldValue<any>[] | undefined,
  ] = Object.entries(field.values)[0];
  const attributes = field.fieldSchema.attributes;
  if (!values)
    return [{ firstFrame: 0, lastFrame: duration, index: 0, value: "" }];

  const res = values.reduce<FieldValue<any>[][]>(
    (prev, curr, index, array) => [...prev, [curr, array[index + 1]]],
    [],
  );
  const result = res.reduce<ReduceFieldBlocksState>(
    (prev, curr) => {
      const [left, right] = curr;
      const [currentBlock, ...otherBlocks] = prev.objectBlocks;
      const rightFrame = right ? right.frame : currentBlock.lastFrame;
      const index = getValueIndex(type as FieldType, left, attributes);
      if (rightFrame <= currentBlock.lastFrame) {
        return {
          objectBlocks: prev.objectBlocks,
          fieldBlocks: [
            ...prev.fieldBlocks,
            {
              firstFrame: left.frame,
              lastFrame: rightFrame,
              value: `${left.value}`,
              index,
            },
          ],
        };
      }
      // TODO: test this part - multiple blocks #11
      const [nextBlock] = otherBlocks;
      return {
        objectBlocks: otherBlocks,
        fieldBlocks: [
          ...prev.fieldBlocks,
          {
            firstFrame: left.frame,
            lastFrame: currentBlock.lastFrame,
            value: `${left.value}`,

            index,
          },
          {
            firstFrame: nextBlock.firstFrame,
            lastFrame: right.frame,
            value: `${left.value}`,
            index,
          },
        ],
      };
    },
    {
      fieldBlocks: [],
      objectBlocks,
    },
  );

  return [...result.fieldBlocks];
}

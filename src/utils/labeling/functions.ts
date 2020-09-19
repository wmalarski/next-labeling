import { v4 as uuidv4 } from "uuid";
import { ObjectSchema } from "../schema/types";
import { LabelingObject } from "./types";

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
        values: { [key]: value?.default },
      };
    }),
  };
}

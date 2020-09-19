import { createObject } from "./functions";
import { LabelingData } from "./types";
import { ObjectSchema } from "../schema/types";

export function addObjectUpdate(
  data: LabelingData,
  objectSchema: ObjectSchema,
  currentFrame: number,
): LabelingData {
  return {
    ...data,
    objects: [...data.objects, createObject(objectSchema, currentFrame)],
  };
}

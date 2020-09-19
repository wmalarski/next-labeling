import { createObject } from "./functions";
import { ExtendedLabeling } from "./types";
import { ObjectSchema } from "../schema/types";

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

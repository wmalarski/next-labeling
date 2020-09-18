import { createObject } from "./functions";
import { LabelingDocument } from "./types";
import { LabelingObjectSchema } from "../schema/types";

export function addObjectUpdate(
  document: LabelingDocument,
  objectSchema: LabelingObjectSchema,
): LabelingDocument {
  return {
    ...document,
    objects: [...document.objects, createObject(objectSchema)],
  };
}

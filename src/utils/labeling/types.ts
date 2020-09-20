import * as t from "io-ts";

import { AuthUser } from "../auth/user";
import { LabelingFieldValues } from "../editors/types";
import { FieldSchema, ObjectSchema, Schema } from "../schema/types";

// ---------- FIELDS ----------------
const LabelingFieldFields = {
  id: t.string,
  fieldSchemaId: t.string,
  values: LabelingFieldValues,
};
export const LabelingField = t.strict(LabelingFieldFields);
export type LabelingField = t.TypeOf<typeof LabelingField>;

// ---------- OBJECTS ---------------
const LabelingObjectFields = {
  id: t.string,
  name: t.string,
  objectSchemaId: t.string,
  fields: t.array(LabelingField),
  isDone: t.boolean,
  isTracked: t.boolean,
  frames: t.union([t.array(t.number), t.null]),
};
export const LabelingObject = t.strict(LabelingObjectFields);
export type LabelingObject = t.TypeOf<typeof LabelingObject>;

// ------------- COMMENT -------------------
export const LabelingComment = t.strict({
  user: AuthUser,
  message: t.string,
  created: t.string,
});
export type LabelingComment = t.TypeOf<typeof LabelingComment>;

// ------------ DOCUMENT -------------------
export const LabelingDocument = t.strict({
  id: t.union([t.string, t.undefined]),
  name: t.string,
  filename: t.string,
  objects: t.array(LabelingObject),
  schemaId: t.string,
  schema: Schema,
  user: AuthUser,
  created: t.string,
  edited: t.array(
    t.strict({
      date: t.string,
      user: AuthUser,
    }),
  ),
  contributors: t.array(t.string),
  projects: t.array(t.string),
  public: t.boolean,
  stars: t.number,
  comments: t.array(LabelingComment),
});
export type LabelingDocument = t.TypeOf<typeof LabelingDocument>;

// ------------ WIP DATA --------------
export const ExtendedField = t.strict({
  ...LabelingFieldFields,
  fieldSchema: FieldSchema,
});
export type ExtendedField = t.TypeOf<typeof ExtendedField>;

export const ExtendedObject = t.strict({
  ...LabelingObjectFields,
  objectSchema: ObjectSchema,
  fields: t.array(ExtendedField),
});
export type ExtendedObject = t.TypeOf<typeof ExtendedObject>;

export const ExtendedLabeling = t.strict({
  objects: t.array(ExtendedObject),
});
export type ExtendedLabeling = t.TypeOf<typeof ExtendedLabeling>;

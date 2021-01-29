import * as t from "io-ts";

import { AuthUser } from "../../src/auth/user";
import { LabelingFieldAttributes } from "../editors/types";

export const FieldSchema = t.strict({
  id: t.string,
  name: t.string,
  perFrame: t.boolean,
  attributes: LabelingFieldAttributes,
});
export type FieldSchema = t.TypeOf<typeof FieldSchema>;

export const ObjectSchema = t.strict({
  id: t.string,
  name: t.string,
  description: t.string,
  singleton: t.boolean,
  fields: t.array(FieldSchema),
});
export type ObjectSchema = t.TypeOf<typeof ObjectSchema>;

export const Schema = t.strict({
  name: t.string,
  version: t.string,
  description: t.string,
  objects: t.array(ObjectSchema),
});
export type Schema = t.TypeOf<typeof Schema>;

export const SchemaDocument = t.strict({
  user: AuthUser,
  schema: Schema,
  stars: t.number,
  createdAt: t.unknown,
  editedAt: t.unknown,
});
export type SchemaDocument = t.TypeOf<typeof SchemaDocument>;

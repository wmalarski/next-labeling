import * as t from "io-ts";

import { AuthUser } from "../auth/user";
import { LabelingFieldAttributes } from "../editors/types";

export const LabelingFieldSchema = t.strict({
  id: t.string,
  name: t.string,
  perFrame: t.boolean,
  attributes: LabelingFieldAttributes,
});
export type LabelingFieldSchema = t.TypeOf<typeof LabelingFieldSchema>;

export const LabelingObjectSchema = t.strict({
  id: t.string,
  name: t.string,
  description: t.string,
  singleton: t.boolean,
  fields: t.array(LabelingFieldSchema),
});
export type LabelingObjectSchema = t.TypeOf<typeof LabelingObjectSchema>;

export const LabelingSchema = t.strict({
  name: t.string,
  version: t.string,
  description: t.string,
  objects: t.array(LabelingObjectSchema),
});
export type LabelingSchema = t.TypeOf<typeof LabelingSchema>;

export const SchemaDocument = t.strict({
  id: t.union([t.string, t.undefined]),
  user: AuthUser,
  schema: LabelingSchema,
  stars: t.number,
  created: t.string,
});
export type SchemaDocument = t.TypeOf<typeof SchemaDocument>;

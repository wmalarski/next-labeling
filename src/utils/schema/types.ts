import * as t from "io-ts";

import { AuthUserType } from "../auth/user";
import { LabelingFieldAttributesType } from "../editors/types";

export const LabelingFieldSchemaType = t.strict({
  id: t.string,
  name: t.string,
  perFrame: t.boolean,
  attributes: LabelingFieldAttributesType,
});
export type LabelingFieldSchema = t.TypeOf<typeof LabelingFieldSchemaType>;

export const LabelingObjectSchemaType = t.strict({
  id: t.string,
  name: t.string,
  description: t.string,
  singleton: t.boolean,
  fields: t.array(LabelingFieldSchemaType),
});
export type LabelingObjectSchema = t.TypeOf<typeof LabelingObjectSchemaType>;

export const LabelingSchemaType = t.strict({
  name: t.string,
  version: t.string,
  description: t.string,
  objects: t.array(LabelingObjectSchemaType),
});
export type LabelingSchema = t.TypeOf<typeof LabelingSchemaType>;

export const SchemaDocumentType = t.strict({
  id: t.union([t.string, t.undefined]),
  user: AuthUserType,
  schema: LabelingSchemaType,
  stars: t.number,
  created: t.strict({
    seconds: t.number,
    nanoseconds: t.number,
  }),
  previousVersionId: t.union([t.string, t.undefined]),
});
export type SchemaDocument = t.TypeOf<typeof SchemaDocumentType>;

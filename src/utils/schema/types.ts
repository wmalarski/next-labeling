import * as t from "io-ts";
import { AuthUser } from "../auth/user";
import { LabelingFieldAttributesType } from "./fields";

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

export interface SchemaDocument {
  id?: string;
  user: AuthUser;
  schema: LabelingSchema;
  stars: number;
  created: Date;
  previousVersionId?: string;
}

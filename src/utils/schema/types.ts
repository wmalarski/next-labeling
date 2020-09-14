import { AuthUser } from "../auth/user";
import { FieldType, LabelingFieldAttributes } from "./fields";

export interface LabelingFieldSchema {
  id: string;
  name: string;
  type: FieldType;
  perFrame: boolean;
  attributes: LabelingFieldAttributes[FieldType];
}

export interface LabelingObjectSchema {
  id: string;
  name: string;
  description: string;
  singleton: boolean;
  fields: LabelingFieldSchema[];
}

export interface LabelingSchema {
  name: string;
  version: string;
  description: string;
  objects: LabelingObjectSchema[];
}

export interface SchemaDocument {
  id?: string;
  user: AuthUser;
  schema: LabelingSchema;
  stars: number;
  created: Date;
  previousVersionId?: string;
}

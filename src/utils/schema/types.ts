import { FieldType, LabelingFieldAttributes } from "./fields";

export interface LabelingFieldSchema {
  id?: string;
  name: string;
  type: FieldType;
  perFrame: boolean;
  attributes: LabelingFieldAttributes[FieldType];
}

export interface LabelingObjectSchema {
  id?: string;
  name: string;
  description: string;
  singleton: boolean;
  fields: LabelingFieldSchema[];
}

export interface LabelingSchema {
  id?: string;
  name: string;
  version: string;
  created: Date;
  description: string;
  objects: LabelingObjectSchema[];
}

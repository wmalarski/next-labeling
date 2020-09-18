import * as t from "io-ts";
import { AuthUser } from "../auth/user";
import { LabelingFieldValues } from "../editors/types";

export const LabelingComment = t.strict({
  user: AuthUser,
  message: t.string,
  created: t.string,
});
export type LabelingComment = t.TypeOf<typeof LabelingComment>;

export const LabelingField = t.strict({
  id: t.string,
  schemaFieldId: t.string,
  values: LabelingFieldValues,
});
export type LabelingField = t.TypeOf<typeof LabelingField>;

export const LabelingObject = t.strict({
  id: t.string,
  name: t.string,
  schemaObjectId: t.string,
  fields: t.array(LabelingField),
  isDone: t.boolean,
  isTracked: t.boolean,
  frames: t.array(t.number),
  comments: t.array(LabelingComment),
});
export type LabelingObject = t.TypeOf<typeof LabelingObject>;

export const LabelingDocument = t.strict({
  id: t.union([t.string, t.undefined]),
  name: t.string,
  filename: t.string,
  schemaId: t.string,
  user: AuthUser,
  objects: t.array(LabelingObject),
  created: t.string,
  editedDate: t.string,
  contributors: t.array(t.string),
  public: t.boolean,
  stars: t.number,
  comments: t.array(LabelingComment),
});
export type LabelingDocument = t.TypeOf<typeof LabelingDocument>;

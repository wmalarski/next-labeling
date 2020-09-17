import * as t from "io-ts";
import { AuthUser } from "../auth/user";
import { LabelingFieldValues } from "../editors/types";

export const LabelingField = t.strict({
  id: t.string,
  definitionId: t.string,
  values: LabelingFieldValues,
});
export type LabelingField = t.TypeOf<typeof LabelingField>;

export const LabelingObject = t.strict({
  id: t.string,
  name: t.string,
  definitionId: t.string,
  fields: t.array(LabelingField),
  isDone: t.boolean,
  isTracked: t.boolean,
  frames: t.array(t.number),
});
export type LabelingObject = t.TypeOf<typeof LabelingObject>;

export const LabelingDocument = t.strict({
  id: t.union([t.string, t.undefined]),
  user: AuthUser,
  objects: t.array(LabelingObject),
  created: t.string,
  edited: t.string,
  contributors: t.array(t.string),
  public: t.boolean,
});
export type LabelingDocument = t.TypeOf<typeof LabelingDocument>;

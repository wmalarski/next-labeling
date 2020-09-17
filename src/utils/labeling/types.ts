import * as t from "io-ts";
import { AuthUserType } from "../auth/user";
import { LabelingFieldValuesType } from "../editors/types";

export const LabelingField = t.strict({
  id: t.string,
  values: LabelingFieldValuesType,
});
export type LabelingField = t.TypeOf<typeof LabelingField>;

export const LabelingObject = t.strict({
  id: t.string,
});
export type LabelingObject = t.TypeOf<typeof LabelingObject>;

export const LabelingDocument = t.strict({
  id: t.union([t.string, t.undefined]),
  user: AuthUserType,
});
export type LabelingDocument = t.TypeOf<typeof LabelingDocument>;

import * as t from "io-ts";

import { AuthUser } from "../../../src/auth/user";
import { Schema } from "../../schema/types";
import { FieldBase, ObjectBase } from "./base";

export const ExternalField = t.strict(FieldBase);
export type ExternalField = t.TypeOf<typeof ExternalField>;

export const ExternalObject = t.strict({
  ...ObjectBase,
  fields: t.array(ExternalField),
});
export type ExternalObject = t.TypeOf<typeof ExternalObject>;

export const ExternalDocument = t.strict({
  name: t.string,
  filename: t.string,
  fps: t.number,
  objects: t.array(ExternalObject),
  schemaId: t.string,
  schema: Schema,
  user: AuthUser,
  createdAt: t.unknown,
  project: t.union([t.string, t.null]),
});
export type ExternalDocument = t.TypeOf<typeof ExternalDocument>;

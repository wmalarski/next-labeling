import * as t from "io-ts";

import { AuthUser } from "../../auth/user";
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
  id: t.union([t.string, t.undefined]),
  name: t.string,
  filename: t.string,
  fps: t.number,
  objects: t.array(ExternalObject),
  schemaId: t.string,
  schema: Schema,
  user: AuthUser,
  created: t.string,
  edited: t.array(
    t.strict({
      date: t.unknown,
      user: AuthUser,
    }),
  ),
  contributors: t.array(t.string),
  projects: t.array(t.string),
  public: t.boolean,
  stars: t.number,
});
export type ExternalDocument = t.TypeOf<typeof ExternalDocument>;

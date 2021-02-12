import * as t from "io-ts";

export const UserDocument = t.strict({
  uid: t.string,
  email: t.union([t.string, t.null]),
  displayName: t.union([t.string, t.null]),
  projects: t.array(t.string),
});
export type UserDocument = t.TypeOf<typeof UserDocument>;

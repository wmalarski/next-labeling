import * as t from "io-ts";

// having trouble getting types from lodash/object
export const AuthUser = t.type({
  id: t.string,
  email: t.union([t.string, t.null]),
  emailVerified: t.boolean,
  displayName: t.string,
});

export type AuthUser = t.TypeOf<typeof AuthUser>;

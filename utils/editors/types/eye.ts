import * as t from "io-ts";

export const EyeValue = t.array(t.number);
export const EyeValues = t.array(
  t.strict({
    frame: t.number,
    value: EyeValue,
  }),
);
export const EyeAttributes = t.strict({
  default: EyeValue,
  color: t.string,
});
export type EyeValue = t.TypeOf<typeof EyeValue>;
export type EyeValues = t.TypeOf<typeof EyeValues>;
export type EyeAttributes = t.TypeOf<typeof EyeAttributes>;

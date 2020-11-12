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
export const EyePositions = t.union([
  t.literal("TOP"),
  t.literal("BOTTOM"),
  t.literal("LEFT"),
  t.literal("RIGHT"),
]);
export type EyeValue = t.TypeOf<typeof EyeValue>;
export type EyeValues = t.TypeOf<typeof EyeValues>;
export type EyeAttributes = t.TypeOf<typeof EyeAttributes>;
export type EyePositions = t.TypeOf<typeof EyePositions>;

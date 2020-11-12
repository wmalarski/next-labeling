import * as t from "io-ts";

export const RectangleValue = t.tuple([t.number, t.number, t.number, t.number]);
export const RectangleValues = t.array(
  t.strict({
    frame: t.number,
    value: RectangleValue,
  }),
);
export const RectangleAttributes = t.strict({
  default: RectangleValue,
  color: t.string,
});
export const RectanglePositions = t.union([
  t.literal("TOP"),
  t.literal("BOTTOM"),
  t.literal("LEFT"),
  t.literal("RIGHT"),
]);
export type RectangleValue = t.TypeOf<typeof RectangleValue>;
export type RectangleValues = t.TypeOf<typeof RectangleValues>;
export type RectangleAttributes = t.TypeOf<typeof RectangleAttributes>;
export type RectanglePositions = t.TypeOf<typeof RectanglePositions>;

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
export type RectangleValue = t.TypeOf<typeof RectangleValue>;
export type RectangleValues = t.TypeOf<typeof RectangleValues>;
export type RectangleAttributes = t.TypeOf<typeof RectangleAttributes>;

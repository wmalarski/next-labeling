import * as t from "io-ts";

export const PolygonValue = t.array(t.number);
export const PolygonValues = t.array(
  t.strict({
    frame: t.number,
    value: PolygonValue,
  }),
);
export const PolygonAttributes = t.strict({
  default: PolygonValue,
  color: t.string,
});
export type PolygonValue = t.TypeOf<typeof PolygonValue>;
export type PolygonValues = t.TypeOf<typeof PolygonValues>;
export type PolygonAttributes = t.TypeOf<typeof PolygonAttributes>;

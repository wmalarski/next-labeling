import * as t from "io-ts";

export const PointValue = t.tuple([t.number, t.number]);
export const PointValues = t.array(
  t.strict({
    frame: t.number,
    value: PointValue,
  }),
);
export const PointAttributes = t.strict({
  default: PointValue,
  color: t.string,
});
export type PointValues = t.TypeOf<typeof PointValues>;
export type PointAttributes = t.TypeOf<typeof PointAttributes>;

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
export const PointPositions = t.union([
  t.literal("TOP"),
  t.literal("BOTTOM"),
  t.literal("LEFT"),
  t.literal("RIGHT"),
]);
export type PointValue = t.TypeOf<typeof PointValue>;
export type PointValues = t.TypeOf<typeof PointValues>;
export type PointAttributes = t.TypeOf<typeof PointAttributes>;
export type PointPositions = t.TypeOf<typeof PointPositions>;

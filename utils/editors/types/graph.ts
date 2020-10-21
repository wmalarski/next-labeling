import * as t from "io-ts";

export const GraphValue = t.strict({
  points: t.array(t.number),
  edges: t.array(t.tuple([t.number, t.number])),
});
export const GraphValues = t.array(
  t.strict({
    frame: t.number,
    value: GraphValue,
  }),
);
export const GraphAttributes = t.strict({
  default: GraphValue,
  color: t.string,
});
export type GraphValues = t.TypeOf<typeof GraphValues>;
export type GraphAttributes = t.TypeOf<typeof GraphAttributes>;

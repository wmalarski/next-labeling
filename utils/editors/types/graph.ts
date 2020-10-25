import * as t from "io-ts";

export const GraphValue = t.strict({
  points: t.array(t.strict({ x: t.number, y: t.number, n: t.number })),
  edges: t.array(t.strict({ from: t.number, to: t.number })),
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
export type GraphValue = t.TypeOf<typeof GraphValue>;
export type GraphValues = t.TypeOf<typeof GraphValues>;
export type GraphAttributes = t.TypeOf<typeof GraphAttributes>;

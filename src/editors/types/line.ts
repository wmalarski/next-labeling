import * as t from "io-ts";

export const LineValue = t.array(t.number);
export const LineValues = t.array(
  t.strict({
    frame: t.number,
    value: LineValue,
  }),
);
export const LineAttributes = t.strict({
  default: LineValue,
  color: t.string,
});
export type LineValue = t.TypeOf<typeof LineValue>;
export type LineValues = t.TypeOf<typeof LineValues>;
export type LineAttributes = t.TypeOf<typeof LineAttributes>;

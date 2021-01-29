import * as t from "io-ts";

export const NumberValue = t.number;
export const NumberValues = t.array(
  t.strict({
    frame: t.number,
    value: NumberValue,
  }),
);
export const NumberAttributes = t.strict({
  min: t.number,
  max: t.number,
  step: t.number,
  default: NumberValue,
});
export type NumberValue = t.TypeOf<typeof NumberValue>;
export type NumberValues = t.TypeOf<typeof NumberValues>;
export type NumberAttributes = t.TypeOf<typeof NumberAttributes>;

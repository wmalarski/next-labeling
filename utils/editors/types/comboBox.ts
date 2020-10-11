import * as t from "io-ts";

export const ComboBoxValue = t.string;
export const ComboBoxValues = t.array(
  t.strict({
    frame: t.number,
    value: ComboBoxValue,
  }),
);
export const ComboBoxAttributes = t.strict({
  default: ComboBoxValue,
  options: t.array(t.string),
});
export type ComboBoxValues = t.TypeOf<typeof ComboBoxValues>;
export type ComboBoxAttributes = t.TypeOf<typeof ComboBoxAttributes>;

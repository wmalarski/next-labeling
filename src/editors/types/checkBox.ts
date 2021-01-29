import * as t from "io-ts";

export const CheckBoxValue = t.boolean;
export const CheckBoxValues = t.array(
  t.strict({
    frame: t.number,
    value: CheckBoxValue,
  }),
);
export const CheckBoxAttributes = t.strict({
  default: CheckBoxValue,
});
export type CheckBoxValue = t.TypeOf<typeof CheckBoxValue>;
export type CheckBoxValues = t.TypeOf<typeof CheckBoxValues>;
export type CheckBoxAttributes = t.TypeOf<typeof CheckBoxAttributes>;

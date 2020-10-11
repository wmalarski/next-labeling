import * as t from "io-ts";

export const MultiSelectValue = t.array(t.string);
export const MultiSelectValues = t.array(
  t.strict({
    frame: t.number,
    value: MultiSelectValue,
  }),
);
export const MultiSelectAttributes = t.strict({
  default: MultiSelectValue,
  options: t.array(
    t.strict({
      text: t.string,
      size: t.number,
    }),
  ),
});
export type MultiSelectValues = t.TypeOf<typeof MultiSelectValues>;
export type MultiSelectAttributes = t.TypeOf<typeof MultiSelectAttributes>;

import * as t from "io-ts";

export const SelectValue = t.string;
export const SelectValues = t.array(
  t.strict({
    frame: t.number,
    value: SelectValue,
  }),
);
export const SelectAttributes = t.strict({
  default: SelectValue,
  options: t.array(
    t.strict({
      text: t.string,
      size: t.number,
    }),
  ),
});
export type SelectValue = t.TypeOf<typeof SelectValue>;
export type SelectValues = t.TypeOf<typeof SelectValues>;
export type SelectAttributes = t.TypeOf<typeof SelectAttributes>;

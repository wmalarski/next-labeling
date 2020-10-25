import * as t from "io-ts";

export const TextValue = t.string;
export const TextValues = t.array(
  t.strict({
    frame: t.number,
    value: TextValue,
  }),
);
export const TextAttributes = t.strict({
  default: TextValue,
});
export type TextValue = t.TypeOf<typeof TextValue>;
export type TextValues = t.TypeOf<typeof TextValues>;
export type TextAttributes = t.TypeOf<typeof TextAttributes>;

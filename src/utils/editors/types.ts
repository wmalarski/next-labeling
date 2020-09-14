import * as t from "io-ts";
import { FieldType, LabelingFieldAttributes } from "../schema/fields";

export const CheckBoxValuesType = t.union([
  t.array(
    t.strict({
      frame: t.number,
      value: t.boolean,
    }),
  ),
  t.strict({
    value: t.boolean,
  }),
]);
export type CheckBoxValues = t.TypeOf<typeof CheckBoxValuesType>;

export const ComboBoxValuesType = t.union([
  t.array(
    t.strict({
      frame: t.number,
      value: t.string,
    }),
  ),
  t.strict({
    value: t.string,
  }),
]);
export type ComboBoxValue = t.TypeOf<typeof ComboBoxValuesType>;

export const TextValuesType = t.union([
  t.array(
    t.strict({
      frame: t.number,
      value: t.string,
    }),
  ),
  t.strict({
    value: t.string,
  }),
]);
export type TextValue = t.TypeOf<typeof TextValuesType>;

export const NumberValuesType = t.union([
  t.array(
    t.strict({
      frame: t.number,
      value: t.number,
    }),
  ),
  t.strict({
    value: t.number,
  }),
]);
export type NumberValue = t.TypeOf<typeof NumberValuesType>;

export const SelectValuesType = t.union([
  t.array(
    t.strict({
      frame: t.number,
      value: t.string,
    }),
  ),
  t.strict({
    value: t.string,
  }),
]);
export type SelectValue = t.TypeOf<typeof SelectValuesType>;

export const MultiSelectValuesType = t.union([
  t.array(
    t.strict({
      frame: t.number,
      value: t.array(t.string),
    }),
  ),
  t.strict({
    value: t.array(t.string),
  }),
]);
export type MultiSelectValue = t.TypeOf<typeof MultiSelectValuesType>;

export const RectangleValuesType = t.union([
  t.array(
    t.strict({
      frame: t.number,
      coords: t.tuple([t.number, t.number, t.number, t.number]),
    }),
  ),
  t.strict({
    coords: t.tuple([t.number, t.number, t.number, t.number]),
  }),
]);
export type RectangleValue = t.TypeOf<typeof RectangleValuesType>;

export const LineValuesType = t.union([
  t.array(
    t.strict({
      frame: t.number,
      coords: t.array(t.tuple([t.number, t.number])),
    }),
  ),
  t.strict({
    coords: t.array(t.tuple([t.number, t.number])),
  }),
]);
export type LineValue = t.TypeOf<typeof LineValuesType>;

export const PointValuesType = t.union([
  t.array(
    t.strict({
      frame: t.number,
      coords: t.tuple([t.number, t.number]),
    }),
  ),
  t.strict({
    coords: t.tuple([t.number, t.number]),
  }),
]);
export type PointValue = t.TypeOf<typeof PointValuesType>;

export const PolygonValuesType = t.union([
  t.array(
    t.strict({
      frame: t.number,
      coords: t.array(t.tuple([t.number, t.number])),
    }),
  ),
  t.strict({
    coords: t.array(t.tuple([t.number, t.number])),
  }),
]);
export type PolygonValue = t.TypeOf<typeof PolygonValuesType>;

// TODO: add check if exact one exist
export const LabelingFieldValueType = t.partial({
  [FieldType.CHECKBOX]: CheckBoxValuesType,
  [FieldType.COMBOBOX]: ComboBoxValuesType,
  [FieldType.TEXT]: TextValuesType,
  [FieldType.NUMERIC]: NumberValuesType,
  [FieldType.SELECT]: SelectValuesType,
  [FieldType.MULSELECT]: MultiSelectValuesType,
  [FieldType.RECTANGLE]: RectangleValuesType,
  [FieldType.LINE]: LineValuesType,
  [FieldType.POINT]: PointValuesType,
  [FieldType.POLYGON]: PolygonValuesType,
});

export type LabelingFieldValues = t.TypeOf<typeof LabelingFieldValueType>;

export type OnValueChangeHandler = (
  provider: (value: LabelingFieldValues) => LabelingFieldValues,
) => void;

export interface FieldEditorProps<T extends keyof LabelingFieldValues> {
  singleton: boolean;
  disabled: boolean;
  frame: number;
  values: LabelingFieldValues[T];
  attributes: LabelingFieldAttributes[T];
  onChange: OnValueChangeHandler;
}

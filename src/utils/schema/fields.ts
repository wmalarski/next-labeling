import * as t from "io-ts";

export const CheckBoxAttributesType = t.strict({
  default: t.boolean,
});
export type CheckBoxAttributes = t.TypeOf<typeof CheckBoxAttributesType>;

export const ComboBoxAttributesType = t.strict({
  default: t.string,
  options: t.array(t.string),
});
export type ComboBoxAttributes = t.TypeOf<typeof ComboBoxAttributesType>;

export const TextAttributesType = t.strict({
  default: t.string,
});
export type TextAttributes = t.TypeOf<typeof TextAttributesType>;

export const NumberAttributesType = t.strict({
  min: t.number,
  max: t.number,
  step: t.number,
  default: t.number,
});
export type NumberAttributes = t.TypeOf<typeof NumberAttributesType>;

export const SelectAttributesType = t.strict({
  default: t.string,
  options: t.array(
    t.strict({
      text: t.string,
      size: t.number,
    }),
  ),
});
export type SelectAttributes = t.TypeOf<typeof SelectAttributesType>;

export const MultiSelectAttributesType = t.strict({
  default: t.array(t.string),
  options: t.array(
    t.strict({
      text: t.string,
      size: t.number,
    }),
  ),
});
export type MultiSelectAttributes = t.TypeOf<typeof MultiSelectAttributesType>;

export const RectangleAttributesType = t.strict({
  color: t.string,
});
export type RectangleAttributes = t.TypeOf<typeof RectangleAttributesType>;

export const LineAttributesType = t.strict({
  color: t.string,
});
export type LineAttributes = t.TypeOf<typeof LineAttributesType>;

export const PointAttributesType = t.strict({
  color: t.string,
});
export type PointAttributes = t.TypeOf<typeof PointAttributesType>;

export const PolygonAttributesType = t.strict({
  color: t.string,
});
export type PolygonAttributes = t.TypeOf<typeof PolygonAttributesType>;

export enum FieldType {
  CHECKBOX = "CheckBox",
  COMBOBOX = "ComboBox",
  TEXT = "Text",
  NUMERIC = "Numeric",
  SELECT = "Select",
  MULSELECT = "MultiSelect",
  RECTANGLE = "Rectangle",
  LINE = "Line",
  POINT = "Point",
  POLYGON = "Polygon",
}

export const LabelingFieldAttributesType = t.partial({
  [FieldType.CHECKBOX]: CheckBoxAttributesType,
  [FieldType.COMBOBOX]: ComboBoxAttributesType,
  [FieldType.TEXT]: TextAttributesType,
  [FieldType.NUMERIC]: NumberAttributesType,
  [FieldType.SELECT]: SelectAttributesType,
  [FieldType.MULSELECT]: MultiSelectAttributesType,
  [FieldType.RECTANGLE]: RectangleAttributesType,
  [FieldType.LINE]: LineAttributesType,
  [FieldType.POINT]: PointAttributesType,
  [FieldType.POLYGON]: PolygonAttributesType,
});

export type LabelingFieldAttributes = t.TypeOf<
  typeof LabelingFieldAttributesType
>;

export type OnAttributeChangeHandler = (
  provider: (
    attributes: LabelingFieldAttributes,
  ) => LabelingFieldAttributes | undefined,
) => void;

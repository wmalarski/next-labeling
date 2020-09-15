import * as t from "io-ts";

export const CheckBoxValueType = t.boolean;
export const CheckBoxValuesType = t.partial({
  frames: t.array(
    t.strict({
      frame: t.number,
      value: CheckBoxValueType,
    }),
  ),
  value: CheckBoxValueType,
});
export const CheckBoxAttributesType = t.strict({
  default: CheckBoxValueType,
});
export type CheckBoxValues = t.TypeOf<typeof CheckBoxValuesType>;
export type CheckBoxAttributes = t.TypeOf<typeof CheckBoxAttributesType>;

// ------------------------------------
export const ComboBoxValueType = t.string;
export const ComboBoxValuesType = t.partial({
  frames: t.array(
    t.strict({
      frame: t.number,
      value: ComboBoxValueType,
    }),
  ),
  value: ComboBoxValueType,
});
export const ComboBoxAttributesType = t.strict({
  default: ComboBoxValueType,
  options: t.array(t.string),
});
export type ComboBoxValue = t.TypeOf<typeof ComboBoxValuesType>;
export type ComboBoxAttributes = t.TypeOf<typeof ComboBoxAttributesType>;

// ------------------------------------
export const TextValueType = t.string;
export const TextValuesType = t.partial({
  frames: t.array(
    t.strict({
      frame: t.number,
      value: TextValueType,
    }),
  ),
  value: TextValueType,
});
export const TextAttributesType = t.strict({
  default: TextValueType,
});
export type TextValues = t.TypeOf<typeof TextValuesType>;
export type TextAttributes = t.TypeOf<typeof TextAttributesType>;

// ------------------------------------
export const NumberValueType = t.number;
export const NumberValuesType = t.partial({
  frames: t.array(
    t.strict({
      frame: t.number,
      value: NumberValueType,
    }),
  ),
  value: NumberValueType,
});
export const NumberAttributesType = t.strict({
  min: t.number,
  max: t.number,
  step: t.number,
  default: NumberValueType,
});
export type NumberValues = t.TypeOf<typeof NumberValuesType>;
export type NumberAttributes = t.TypeOf<typeof NumberAttributesType>;

// ------------------------------------
export const SelectValueType = t.string;
export const SelectValuesType = t.partial({
  frames: t.array(
    t.strict({
      frame: t.number,
      value: SelectValueType,
    }),
  ),
  value: SelectValueType,
});
export const SelectAttributesType = t.strict({
  default: SelectValueType,
  options: t.array(
    t.strict({
      text: t.string,
      size: t.number,
    }),
  ),
});
export type SelectValues = t.TypeOf<typeof SelectValuesType>;
export type SelectAttributes = t.TypeOf<typeof SelectAttributesType>;

// ------------------------------------
export const MultiSelectValueType = t.array(t.string);
export const MultiSelectValuesType = t.partial({
  frames: t.array(
    t.strict({
      frame: t.number,
      value: MultiSelectValueType,
    }),
  ),
  value: MultiSelectValueType,
});
export const MultiSelectAttributesType = t.strict({
  default: MultiSelectValueType,
  options: t.array(
    t.strict({
      text: t.string,
      size: t.number,
    }),
  ),
});
export type MultiSelectValues = t.TypeOf<typeof MultiSelectValuesType>;
export type MultiSelectAttributes = t.TypeOf<typeof MultiSelectAttributesType>;

// ------------------------------------
export const RectangleValueType = t.tuple([
  t.number,
  t.number,
  t.number,
  t.number,
]);
export const RectangleValuesType = t.partial({
  frames: t.array(
    t.strict({
      frame: t.number,
      value: RectangleValueType,
    }),
  ),
  value: RectangleValueType,
});
export const RectangleAttributesType = t.strict({
  default: RectangleValueType,
  color: t.string,
});
export type RectangleValues = t.TypeOf<typeof RectangleValuesType>;
export type RectangleAttributes = t.TypeOf<typeof RectangleAttributesType>;

// ------------------------------------
export const LineValueType = t.array(t.tuple([t.number, t.number]));
export const LineValuesType = t.partial({
  frames: t.array(
    t.strict({
      frame: t.number,
      value: LineValueType,
    }),
  ),
  value: LineValueType,
});
export const LineAttributesType = t.strict({
  default: LineValueType,
  color: t.string,
});
export type LineValues = t.TypeOf<typeof LineValuesType>;
export type LineAttributes = t.TypeOf<typeof LineAttributesType>;

// ------------------------------------
export const PointValueType = t.tuple([t.number, t.number]);
export const PointValuesType = t.partial({
  frames: t.array(
    t.strict({
      frame: t.number,
      value: PointValueType,
    }),
  ),
  value: PointValueType,
});
export const PointAttributesType = t.strict({
  default: PointValueType,
  color: t.string,
});
export type PointValues = t.TypeOf<typeof PointValuesType>;
export type PointAttributes = t.TypeOf<typeof PointAttributesType>;

// ------------------------------------
export const PolygonValueType = t.array(t.tuple([t.number, t.number]));
export const PolygonValuesType = t.partial({
  frames: t.array(
    t.strict({
      frame: t.number,
      value: PolygonValueType,
    }),
  ),
  value: PolygonValueType,
});
export const PolygonAttributesType = t.strict({
  default: PolygonValueType,
  color: t.string,
});
export type PolygonValues = t.TypeOf<typeof PolygonValuesType>;
export type PolygonAttributes = t.TypeOf<typeof PolygonAttributesType>;

// ------------------------------------
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

// TODO: add check if exact one exist
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
  name: string;
  perFrame: boolean;
  disabled: boolean;
  frame: number;
  values: LabelingFieldValues[T];
  attributes: LabelingFieldAttributes[T];
  onChange: OnValueChangeHandler;
}

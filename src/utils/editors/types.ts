import * as t from "io-ts";

export const CheckBoxValueType = t.boolean;
export const CheckBoxValuesType = t.array(
  t.strict({
    frame: t.number,
    value: CheckBoxValueType,
  }),
);
export const CheckBoxAttributesType = t.strict({
  default: CheckBoxValueType,
});
export type CheckBoxValues = t.TypeOf<typeof CheckBoxValuesType>;
export type CheckBoxAttributes = t.TypeOf<typeof CheckBoxAttributesType>;

// ------------------------------------
export const ComboBoxValueType = t.string;
export const ComboBoxValuesType = t.array(
  t.strict({
    frame: t.number,
    value: ComboBoxValueType,
  }),
);
export const ComboBoxAttributesType = t.strict({
  default: ComboBoxValueType,
  options: t.array(t.string),
});
export type ComboBoxValues = t.TypeOf<typeof ComboBoxValuesType>;
export type ComboBoxAttributes = t.TypeOf<typeof ComboBoxAttributesType>;

// ------------------------------------
export const TextValueType = t.string;
export const TextValuesType = t.array(
  t.strict({
    frame: t.number,
    value: TextValueType,
  }),
);
export const TextAttributesType = t.strict({
  default: TextValueType,
});
export type TextValues = t.TypeOf<typeof TextValuesType>;
export type TextAttributes = t.TypeOf<typeof TextAttributesType>;

// ------------------------------------
export const NumberValueType = t.number;
export const NumberValuesType = t.array(
  t.strict({
    frame: t.number,
    value: NumberValueType,
  }),
);
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
export const SelectValuesType = t.array(
  t.strict({
    frame: t.number,
    value: SelectValueType,
  }),
);
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
export const MultiSelectValuesType = t.array(
  t.strict({
    frame: t.number,
    value: MultiSelectValueType,
  }),
);
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
export const RectangleValuesType = t.array(
  t.strict({
    frame: t.number,
    value: RectangleValueType,
  }),
);
export const RectangleAttributesType = t.strict({
  default: RectangleValueType,
  color: t.string,
});
export type RectangleValues = t.TypeOf<typeof RectangleValuesType>;
export type RectangleAttributes = t.TypeOf<typeof RectangleAttributesType>;

// ------------------------------------
export const LineValueType = t.array(t.tuple([t.number, t.number]));
export const LineValuesType = t.array(
  t.strict({
    frame: t.number,
    value: LineValueType,
  }),
);
export const LineAttributesType = t.strict({
  default: LineValueType,
  color: t.string,
});
export type LineValues = t.TypeOf<typeof LineValuesType>;
export type LineAttributes = t.TypeOf<typeof LineAttributesType>;

// ------------------------------------
export const PointValueType = t.tuple([t.number, t.number]);
export const PointValuesType = t.array(
  t.strict({
    frame: t.number,
    value: PointValueType,
  }),
);
export const PointAttributesType = t.strict({
  default: PointValueType,
  color: t.string,
});
export type PointValues = t.TypeOf<typeof PointValuesType>;
export type PointAttributes = t.TypeOf<typeof PointAttributesType>;

// ------------------------------------
export const PolygonValueType = t.array(t.tuple([t.number, t.number]));
export const PolygonValuesType = t.array(
  t.strict({
    frame: t.number,
    value: PolygonValueType,
  }),
);
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
export const LabelingFieldValueType = t.partial({
  [FieldType.CHECKBOX]: CheckBoxValueType,
  [FieldType.COMBOBOX]: ComboBoxValueType,
  [FieldType.TEXT]: TextValueType,
  [FieldType.NUMERIC]: NumberValueType,
  [FieldType.SELECT]: SelectValueType,
  [FieldType.MULSELECT]: MultiSelectValueType,
  [FieldType.RECTANGLE]: RectangleValueType,
  [FieldType.LINE]: LineValueType,
  [FieldType.POINT]: PointValueType,
  [FieldType.POLYGON]: PolygonValueType,
});
export type LabelingFieldValue = t.TypeOf<typeof LabelingFieldValueType>;

// TODO: add check if exact one exist
export const LabelingFieldValuesType = t.partial({
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
export type LabelingFieldValues = t.TypeOf<typeof LabelingFieldValuesType>;
export type OnValueChangeHandler = (
  provider: (value: LabelingFieldValues) => LabelingFieldValues,
) => void;

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

export interface FieldEditorProps<T extends keyof LabelingFieldValues> {
  name: string;
  perFrame: boolean;
  disabled: boolean;
  frame: number;
  values: LabelingFieldValues[T];
  attributes: LabelingFieldAttributes[T];
  onChange: OnValueChangeHandler;
}

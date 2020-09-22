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
export type CheckBoxValues = t.TypeOf<typeof CheckBoxValues>;
export type CheckBoxAttributes = t.TypeOf<typeof CheckBoxAttributes>;

// ------------------------------------
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

// ------------------------------------
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
export type TextValues = t.TypeOf<typeof TextValues>;
export type TextAttributes = t.TypeOf<typeof TextAttributes>;

// ------------------------------------
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
export type NumberValues = t.TypeOf<typeof NumberValues>;
export type NumberAttributes = t.TypeOf<typeof NumberAttributes>;

// ------------------------------------
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
export type SelectValues = t.TypeOf<typeof SelectValues>;
export type SelectAttributes = t.TypeOf<typeof SelectAttributes>;

// ------------------------------------
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

// ------------------------------------
export const RectangleValue = t.tuple([t.number, t.number, t.number, t.number]);
export const RectangleValues = t.array(
  t.strict({
    frame: t.number,
    value: RectangleValue,
  }),
);
export const RectangleAttributes = t.strict({
  default: RectangleValue,
  color: t.string,
});
export type RectangleValues = t.TypeOf<typeof RectangleValues>;
export type RectangleAttributes = t.TypeOf<typeof RectangleAttributes>;

// ------------------------------------
export const LineValue = t.array(t.tuple([t.number, t.number]));
export const LineValues = t.array(
  t.strict({
    frame: t.number,
    value: LineValue,
  }),
);
export const LineAttributes = t.strict({
  default: LineValue,
  color: t.string,
});
export type LineValues = t.TypeOf<typeof LineValues>;
export type LineAttributes = t.TypeOf<typeof LineAttributes>;

// ------------------------------------
export const PointValue = t.tuple([t.number, t.number]);
export const PointValues = t.array(
  t.strict({
    frame: t.number,
    value: PointValue,
  }),
);
export const PointAttributes = t.strict({
  default: PointValue,
  color: t.string,
});
export type PointValues = t.TypeOf<typeof PointValues>;
export type PointAttributes = t.TypeOf<typeof PointAttributes>;

// ------------------------------------
export const PolygonValue = t.array(t.tuple([t.number, t.number]));
export const PolygonValues = t.array(
  t.strict({
    frame: t.number,
    value: PolygonValue,
  }),
);
export const PolygonAttributes = t.strict({
  default: PolygonValue,
  color: t.string,
});
export type PolygonValues = t.TypeOf<typeof PolygonValues>;
export type PolygonAttributes = t.TypeOf<typeof PolygonAttributes>;

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

// TODO: add check if exact one exist #10
export const LabelingFieldValue = t.partial({
  [FieldType.CHECKBOX]: CheckBoxValue,
  [FieldType.COMBOBOX]: ComboBoxValue,
  [FieldType.TEXT]: TextValue,
  [FieldType.NUMERIC]: NumberValue,
  [FieldType.SELECT]: SelectValue,
  [FieldType.MULSELECT]: MultiSelectValue,
  [FieldType.RECTANGLE]: RectangleValue,
  [FieldType.LINE]: LineValue,
  [FieldType.POINT]: PointValue,
  [FieldType.POLYGON]: PolygonValue,
});
export type LabelingFieldValue = t.TypeOf<typeof LabelingFieldValue>;

// TODO: add check if exact one exist #10
export const LabelingFieldValues = t.partial({
  [FieldType.CHECKBOX]: CheckBoxValues,
  [FieldType.COMBOBOX]: ComboBoxValues,
  [FieldType.TEXT]: TextValues,
  [FieldType.NUMERIC]: NumberValues,
  [FieldType.SELECT]: SelectValues,
  [FieldType.MULSELECT]: MultiSelectValues,
  [FieldType.RECTANGLE]: RectangleValues,
  [FieldType.LINE]: LineValues,
  [FieldType.POINT]: PointValues,
  [FieldType.POLYGON]: PolygonValues,
});
export type LabelingFieldValues = t.TypeOf<typeof LabelingFieldValues>;
export type OnValueChangeHandler = (
  provider: (value: LabelingFieldValues) => LabelingFieldValues,
) => void;

// TODO: add check if exact one exist #10
export const LabelingFieldAttributes = t.partial({
  [FieldType.CHECKBOX]: CheckBoxAttributes,
  [FieldType.COMBOBOX]: ComboBoxAttributes,
  [FieldType.TEXT]: TextAttributes,
  [FieldType.NUMERIC]: NumberAttributes,
  [FieldType.SELECT]: SelectAttributes,
  [FieldType.MULSELECT]: MultiSelectAttributes,
  [FieldType.RECTANGLE]: RectangleAttributes,
  [FieldType.LINE]: LineAttributes,
  [FieldType.POINT]: PointAttributes,
  [FieldType.POLYGON]: PolygonAttributes,
});
export type LabelingFieldAttributes = t.TypeOf<typeof LabelingFieldAttributes>;
export type OnAttributeChangeHandler = (
  provider: (
    attributes: LabelingFieldAttributes,
  ) => LabelingFieldAttributes | undefined,
) => void;

export interface FieldValue<T extends keyof LabelingFieldValues> {
  value: LabelingFieldValue[T];
  frame: number;
}

export interface FieldEditorProps<T extends keyof LabelingFieldValues> {
  name: string;
  perFrame: boolean;
  disabled: boolean;
  frame: number;
  values: LabelingFieldValues[T];
  attributes: LabelingFieldAttributes;
  onChange: OnValueChangeHandler;
}

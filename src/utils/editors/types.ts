import * as t from "io-ts";
import { CheckBoxAttributes, CheckBoxValues } from "./types/checkBox";
import { ComboBoxAttributes, ComboBoxValues } from "./types/comboBox";
import { LineAttributes, LineValues } from "./types/line";
import { MultiSelectAttributes, MultiSelectValues } from "./types/multiSelect";
import { NumberAttributes, NumberValues } from "./types/number";
import { PointAttributes, PointValues } from "./types/point";
import { PolygonAttributes, PolygonValues } from "./types/polygon";
import { RectangleAttributes, RectangleValues } from "./types/rectangle";
import { SelectAttributes, SelectValues } from "./types/select";
import { TextAttributes, TextValues } from "./types/text";

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

export interface FieldEditorProps {
  name: string;
  perFrame: boolean;
  disabled: boolean;
  frame: number;
  values: LabelingFieldValues;
  attributes: LabelingFieldAttributes;
  onChange: OnValueChangeHandler;
}

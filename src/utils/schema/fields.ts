export enum FieldType {
  CHECKBOX = "CheckBox",
  COMBOBOX = "ComboBox",
  TEXT = "Text",
  NUMBER = "Numeric",
  SELECT = "Select",
  MULSELECT = "MultiSelect",
  RECTANGLE = "Rectangle",
  LINE = "Line",
  POINT = "Point",
  POLYGON = "Polygon",
}

export interface CheckBoxAttributes {
  default: boolean;
}

export interface ComboBoxAttributes {
  default: string;
  options: string[];
}

export interface TextAttributes {
  default: string;
}

export interface NumberAttributes {
  min: number;
  max: number;
  step: number;
  default: number;
}

export interface SelectAttributes {
  default: string;
  options: {
    text: string;
    size: number;
  }[];
}

export interface MultiSelectAttributes {
  default: string[];
  options: {
    text: string;
    size: number;
  }[];
}

export interface RectangleAttributes {
  color: string;
}

export interface LineAttributes {
  color: string;
}

export interface PointAttributes {
  color: string;
}

export interface PolygonAttributes {
  color: string;
}

export interface LabelingFieldAttributes {
  [FieldType.CHECKBOX]: CheckBoxAttributes;
  [FieldType.COMBOBOX]: ComboBoxAttributes;
  [FieldType.TEXT]: TextAttributes;
  [FieldType.NUMBER]: NumberAttributes;
  [FieldType.SELECT]: SelectAttributes;
  [FieldType.MULSELECT]: MultiSelectAttributes;
  [FieldType.RECTANGLE]: RectangleAttributes;
  [FieldType.LINE]: LineAttributes;
  [FieldType.POINT]: PointAttributes;
  [FieldType.POLYGON]: PolygonAttributes;
}

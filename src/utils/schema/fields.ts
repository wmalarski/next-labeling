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

export const labelingFieldAttributesDefaults: LabelingFieldAttributes = {
  [FieldType.CHECKBOX]: {
    default: false,
  },
  [FieldType.COMBOBOX]: {
    default: "Car",
    options: ["Car", "Pedestrian", "Motor", "Bicycle"],
  },
  [FieldType.TEXT]: {
    default: "France",
  },
  [FieldType.NUMBER]: {
    default: 50,
    min: 5,
    step: 5,
    max: 200,
  },
  [FieldType.SELECT]: {
    default: "Sunny",
    options: [
      {
        text: "Sunny",
        size: 3,
      },
      {
        text: "Rain",
        size: 3,
      },
      {
        text: "Clouds",
        size: 3,
      },
      {
        text: "Snow",
        size: 3,
      },
    ],
  },
  [FieldType.MULSELECT]: {
    default: ["Left", "Right"],
    options: [
      {
        text: "Left Border",
        size: 3,
      },
      {
        text: "Left Lane",
        size: 3,
      },
      {
        text: "Right Lane",
        size: 3,
      },
      {
        text: "Right Border",
        size: 3,
      },
    ],
  },
  [FieldType.RECTANGLE]: {
    color: "#ff0000",
  },
  [FieldType.LINE]: {
    color: "#ff0000",
  },
  [FieldType.POINT]: {
    color: "#ff0000",
  },
  [FieldType.POLYGON]: {
    color: "#ff0000",
  },
};

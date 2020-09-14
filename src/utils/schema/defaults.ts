import uniqueId from "lodash/uniqueId";
import { FieldType, LabelingFieldAttributes } from "./fields";
import { LabelingSchema } from "./types";

export const defaultLabelingSchema: LabelingSchema = {
  name: "New Schema",
  description: "My first schema.",
  stars: 0,
  objects: [
    {
      id: uniqueId("object_"),
      name: "Car",
      description: "Tip: Only moving vehicles",
      singleton: false,
      fields: [
        {
          id: uniqueId("field_"),
          name: "Direction",
          perFrame: true,
          type: FieldType.COMBOBOX,
          attributes: {
            default: "Oncoming",
            options: ["Oncoming", "Preceding", "From Right", "From Left"],
          },
        },
      ],
    },
  ],
  created: new Date(),
  version: "0.0.1",
};

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

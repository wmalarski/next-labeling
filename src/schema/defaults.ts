import { nanoid } from "@reduxjs/toolkit";
import { FieldType, LabelingFieldAttributes } from "../editors/types";
import { Schema } from "./types";

export const defaultLabelingSchema: Schema = {
  name: "New Schema",
  description: "My first schema.",
  objects: [
    {
      id: nanoid(),
      name: "Car",
      description: "Tip: Only moving vehicles",
      singleton: false,
      fields: [
        {
          id: nanoid(),
          name: "Direction",
          perFrame: true,
          attributes: {
            ComboBox: {
              default: "Oncoming",
              options: ["Oncoming", "Preceding", "From Right", "From Left"],
            },
          },
        },
      ],
    },
  ],
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
  [FieldType.NUMERIC]: {
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
    default: ["Left Lane", "Right Lane"],
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
    default: [0, 0, 0, 0], // TODO: Fix defaults for shapes
    color: "#ff0000",
  },
  [FieldType.LINE]: {
    default: [],
    color: "#ff0000",
  },
  [FieldType.POINT]: {
    default: [0, 0],
    color: "#ff0000",
  },
  [FieldType.POLYGON]: {
    default: [],
    color: "#ff0000",
  },
  [FieldType.BOX3D]: {
    default: {
      front: [0, 0, 0, 0],
      side: null,
      sideType: null,
    },
    color: "#ff0000",
  },
  [FieldType.GRAPH]: {
    default: {
      edges: [],
      points: [],
    },
    color: "#ff0000",
  },
  [FieldType.EYE]: {
    default: [],
    color: "$ff0000",
  },
};

import compact from "lodash/compact";

import { FieldType } from "../editors/types";
import { LabelingField, LabelingObject } from "../labeling/types/client";
import Box3dBuilder from "./objects/box3dBuilder";
import EyeBuilder from "./objects/eyeBuilder";
import LineBuilder from "./objects/lineBuilder";
import PointBuilder from "./objects/pointBuilder";
import RectangleBuilder from "./objects/rectangleBuilder";
import { CoordsBuilder } from "./types";

export interface CoordsFieldBuilder {
  builder: CoordsBuilder;
  field: LabelingField;
}

export default function getCoordsBuilders(
  object?: LabelingObject,
): CoordsFieldBuilder[] {
  if (!object) return [];
  return compact(
    object.fields.map(field => {
      const fieldType = Object.keys(field.fieldSchema.attributes)[0];
      switch (fieldType) {
        case FieldType.RECTANGLE:
          return { field, builder: RectangleBuilder };
        case FieldType.POINT:
          return { field, builder: PointBuilder };
        case FieldType.BOX3D:
          return { field, builder: Box3dBuilder };
        case FieldType.EYE:
          return { field, builder: EyeBuilder };
        case FieldType.LINE:
        case FieldType.POLYGON:
        case FieldType.GRAPH:
          return { field, builder: LineBuilder };
        default:
          return null;
      }
    }),
  );
}

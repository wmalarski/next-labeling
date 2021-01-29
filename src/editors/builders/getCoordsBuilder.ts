import compact from "lodash/compact";
import { LabelingField, LabelingObject } from "../../workspace/types/client";
import { CoordsBuilder, FieldType } from "../types";
import Box3dBuilder from "./box3dBuilder";
import EyeBuilder from "./eyeBuilder";
import GraphBuilder from "./graphBuilder";
import LineBuilder from "./lineBuilder";
import PointBuilder from "./pointBuilder";
import PolygonBuilder from "./polygonBuilder";
import RectangleBuilder from "./rectangleBuilder";

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
        case FieldType.GRAPH:
          return { field, builder: GraphBuilder };
        case FieldType.BOX3D:
          return { field, builder: Box3dBuilder };
        case FieldType.EYE:
          return { field, builder: EyeBuilder };
        case FieldType.LINE:
          return { field, builder: LineBuilder };
        case FieldType.POLYGON:
          return { field, builder: PolygonBuilder };
        default:
          return null;
      }
    }),
  );
}

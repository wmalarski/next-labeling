import { FieldType } from "../editors/types";
import { LabelingField, LabelingObject } from "../labeling/types/client";
import { LineBuilder } from "./objects/lane";
import { PointBuilder } from "./objects/point";
import { PolygonBuilder } from "./objects/polygon";
import { RectangleBuilder } from "./objects/rectangle";
import { CoordsBuilder } from "./types";

export interface CoordsFieldBuilder {
  builder: CoordsBuilder;
  field: LabelingField;
}

export default function getCoordsBuilders(
  object?: LabelingObject,
): CoordsFieldBuilder[] {
  if (!object) return [];
  return object.fields.flatMap(field => {
    const fieldType = Object.keys(field.fieldSchema.attributes)[0];
    switch (fieldType) {
      case FieldType.RECTANGLE:
        return [{ field, builder: RectangleBuilder }];
      case FieldType.POINT:
        return [{ field, builder: PointBuilder }];
      case FieldType.LINE:
        return [{ field, builder: LineBuilder }];
      case FieldType.POLYGON:
        return [{ field, builder: PolygonBuilder }];
      default:
        return [];
    }
  });
}

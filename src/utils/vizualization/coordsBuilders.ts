import * as PIXI from "pixi.js";

import { FieldType, LabelingFieldValue } from "../editors/types";
import { ExtendedField, ExtendedObject } from "../labeling/types";

export interface CoordsBuilderResult {
  stage: number;
  value?: LabelingFieldValue;
  canBeFinished: boolean;
}

export type CoordsBuilder = (
  point: PIXI.Point,
  value?: LabelingFieldValue,
) => CoordsBuilderResult | undefined;

export enum RectangleBuilderStage {
  NO_POINTS = 0,
  ONE_POINT = 1,
  TWO_POINTS = 2,
}

export const RectangleBuilder: CoordsBuilder = (point, value) => {
  if (!value?.Rectangle) {
    return {
      canBeFinished: false,
      value: { [FieldType.RECTANGLE]: [point.x, point.y, 0, 0] },
      stage: RectangleBuilderStage.ONE_POINT,
    };
  }
  return {
    canBeFinished: true,
    value: {
      [FieldType.RECTANGLE]: [
        value.Rectangle[0],
        value.Rectangle[1],
        point.x,
        point.y,
      ],
    },
    stage: RectangleBuilderStage.TWO_POINTS,
  };
};

export enum PointBuilderStage {
  NO_POINTS = 0,
  ONE_POINT = 1,
}

export const PointBuilder: CoordsBuilder = point => {
  return {
    canBeFinished: true,
    value: { [FieldType.POINT]: [point.x, point.y] },
    stage: PointBuilderStage.ONE_POINT,
  };
};

export enum LineBuilderStage {
  NO_POINTS = 0,
  MANY_POINTS = 1,
}

export const LineBuilder: CoordsBuilder = (point, values) => {
  const points = values?.Line ?? [];
  return {
    canBeFinished: false,
    value: { [FieldType.LINE]: [...points, [point.x, point.y]] },
    stage: LineBuilderStage.MANY_POINTS,
  };
};

export enum PolygonBuilderStage {
  NO_POINTS = 0,
  MANY_POINTS = 1,
}

export const PolygonBuilder: CoordsBuilder = (point, values) => {
  const points = values?.Line ?? [];
  return {
    canBeFinished: false,
    value: { [FieldType.POLYGON]: [...points, [point.x, point.y]] },
    stage: LineBuilderStage.MANY_POINTS,
  };
};

export interface CoordsFieldBuilder {
  builder: CoordsBuilder;
  field: ExtendedField;
}

export default function getCoordsBuilders(
  object?: ExtendedObject,
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

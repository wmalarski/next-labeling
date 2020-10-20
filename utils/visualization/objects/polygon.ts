import { FieldType } from "../../editors/types";
import { CoordsBuilder } from "../types";

export enum PolygonBuilderStage {
  NO_POINTS = 0,
  ONE_POINT = 1,
  MANY_POINTS = 2,
}

export const PolygonBuilder: CoordsBuilder = (point, frame, values) => {
  const polygon = values?.Polygon;
  if (!polygon)
    return {
      canBeFinished: false,
      isFinished: false,
      value: { [FieldType.POLYGON]: [{ frame, value: [point.x, point.y] }] },
      stage: PolygonBuilderStage.ONE_POINT,
    };
  const points = polygon[0].value;
  return {
    canBeFinished: true,
    isFinished: false,
    value: {
      [FieldType.POLYGON]: [{ frame, value: [...points, point.x, point.y] }],
    },
    stage: PolygonBuilderStage.MANY_POINTS,
  };
};

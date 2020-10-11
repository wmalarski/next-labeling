import { FieldType } from "../../editors/types";
import { CoordsBuilder } from "../types";

export enum PolygonBuilderStage {
  NO_POINTS = 0,
  MANY_POINTS = 1,
}

export const PolygonBuilder: CoordsBuilder = (point, frame, values) => {
  const polygon = values?.Polygon;
  if (!polygon)
    return {
      canBeFinished: true,
      isFinished: false,
      value: values,
      stage: PolygonBuilderStage.MANY_POINTS,
    };
  const points = polygon[0].value;
  return {
    canBeFinished: true,
    isFinished: false,
    value: {
      [FieldType.POLYGON]: [{ frame, value: [...points, [point.x, point.y]] }],
    },
    stage: PolygonBuilderStage.MANY_POINTS,
  };
};

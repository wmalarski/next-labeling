import { CoordsBuilder, FieldType } from "../types";

export enum PolgonBuilderStage {
  NO_POINTS = 0,
  ONE_POINT = 1,
  MANY_POINTS = 2,
}

const PolygonBuilder: CoordsBuilder = (point, frame, values) => {
  const polygon = values?.Polygon;
  if (!polygon)
    return {
      canBeFinished: false,
      isFinished: false,
      value: { [FieldType.POLYGON]: [{ frame, value: [point.x, point.y] }] },
      stage: PolgonBuilderStage.ONE_POINT,
    };
  const points = polygon[0].value;
  return {
    canBeFinished: true,
    isFinished: false,
    value: {
      [FieldType.POLYGON]: [{ frame, value: [...points, point.x, point.y] }],
    },
    stage: PolgonBuilderStage.MANY_POINTS,
  };
};

export default PolygonBuilder;
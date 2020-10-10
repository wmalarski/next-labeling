import { FieldType } from "../../editors/types";
import { CoordsBuilder } from "../types";

export enum PolygonBuilderStage {
  NO_POINTS = 0,
  MANY_POINTS = 1,
}

export const PolygonBuilder: CoordsBuilder = (point, values) => {
  const points = values?.Line ?? [];
  return {
    canBeFinished: true,
    isFinished: false,
    value: { [FieldType.POLYGON]: [...points, [point.x, point.y]] },
    stage: PolygonBuilderStage.MANY_POINTS,
  };
};

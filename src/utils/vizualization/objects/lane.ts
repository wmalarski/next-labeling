import { FieldType } from "../../editors/types";
import { CoordsBuilder } from "../types";

export enum LineBuilderStage {
  NO_POINTS = 0,
  MANY_POINTS = 1,
}

export const LineBuilder: CoordsBuilder = (point, values) => {
  const points = values?.Line ?? [];
  return {
    canBeFinished: true,
    isFinished: false,
    value: { [FieldType.LINE]: [...points, [point.x, point.y]] },
    stage: LineBuilderStage.MANY_POINTS,
  };
};

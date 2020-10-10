import { FieldType } from "../../editors/types";
import { CoordsBuilder } from "../types";

export enum PointBuilderStage {
  NO_POINTS = 0,
  ONE_POINT = 1,
}

export const PointBuilder: CoordsBuilder = (point, frame) => {
  return {
    canBeFinished: true,
    isFinished: true,
    value: { [FieldType.POINT]: [{ value: [point.x, point.y], frame }] },
    stage: PointBuilderStage.ONE_POINT,
  };
};

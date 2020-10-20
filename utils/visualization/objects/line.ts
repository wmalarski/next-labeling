import { FieldType } from "../../editors/types";
import { CoordsBuilder } from "../types";

export enum LineBuilderStage {
  NO_POINTS = 0,
  ONE_POINT = 1,
  MANY_POINTS = 2,
}

export const LineBuilder: CoordsBuilder = (point, frame, values) => {
  const line = values?.Line;
  if (!line)
    return {
      canBeFinished: false,
      isFinished: false,
      value: { [FieldType.LINE]: [{ frame, value: [point.x, point.y] }] },
      stage: LineBuilderStage.ONE_POINT,
    };
  const points = line[0].value;
  return {
    canBeFinished: true,
    isFinished: false,
    value: {
      [FieldType.LINE]: [{ frame, value: [...points, point.x, point.y] }],
    },
    stage: LineBuilderStage.MANY_POINTS,
  };
};

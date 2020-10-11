import { FieldType } from "../../editors/types";
import { CoordsBuilder } from "../types";

export enum LineBuilderStage {
  NO_POINTS = 0,
  MANY_POINTS = 1,
}

export const LineBuilder: CoordsBuilder = (point, frame, values) => {
  const line = values?.Line;
  if (!line)
    return {
      canBeFinished: true,
      isFinished: false,
      value: values,
      stage: LineBuilderStage.MANY_POINTS,
    };
  const points = line[0].value;
  return {
    canBeFinished: true,
    isFinished: false,
    value: {
      [FieldType.LINE]: [
        {
          frame,
          value: [...points, [point.x, point.y]],
        },
      ],
    },
    stage: LineBuilderStage.MANY_POINTS,
  };
};

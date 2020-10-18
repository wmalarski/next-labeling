import { FieldType } from "../../editors/types";
import { CoordsBuilder } from "../types";

export enum RectangleBuilderStage {
  NO_POINTS = 0,
  ONE_POINT = 1,
  TWO_POINTS = 2,
}

export const RectangleBuilder: CoordsBuilder = (point, frame, value) => {
  const rectangle = value?.Rectangle;
  if (!rectangle) {
    return {
      canBeFinished: false,
      isFinished: false,
      value: {
        [FieldType.RECTANGLE]: [{ frame, value: [point.x, point.y, 0, 0] }],
      },
      stage: RectangleBuilderStage.ONE_POINT,
    };
  }
  const previous = rectangle[0].value;
  return {
    canBeFinished: true,
    isFinished: true,
    value: {
      [FieldType.RECTANGLE]: [
        {
          frame,
          value: [previous[0], previous[1], point.x, point.y],
        },
      ],
    },
    stage: RectangleBuilderStage.TWO_POINTS,
  };
};

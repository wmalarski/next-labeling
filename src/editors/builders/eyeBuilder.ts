import { CoordsBuilder, FieldType } from "../types";

export enum EyeBuilderStage {
  NO_POINTS = 0,
  ONE_POINT = 1,
  TWO_POINTS = 2,
  THREE_POINTS = 3,
  FOUR_POINTS = 4,
}

const EyeBuilder: CoordsBuilder = (point, frame, values) => {
  const eye = values?.Eye;
  if (!eye)
    return {
      canBeFinished: false,
      isFinished: false,
      value: { [FieldType.EYE]: [{ frame, value: [point.x, point.y] }] },
      stage: EyeBuilderStage.ONE_POINT,
    };
  const points = eye[0].value;
  const previousStage = points.length / 2;
  const isFinished = previousStage === EyeBuilderStage.THREE_POINTS;
  return {
    canBeFinished: isFinished,
    isFinished: isFinished,
    value: {
      [FieldType.EYE]: [{ frame, value: [...points, point.x, point.y] }],
    },
    stage: previousStage + 1,
  };
};

export default EyeBuilder;

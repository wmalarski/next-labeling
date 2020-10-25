import { FieldType } from "../../editors/types";
import { CoordsBuilder } from "../types";

export enum Box3dBuilderStage {
  NO_POINTS = 0,
  ONE_POINT = 1,
  TWO_POINTS = 2,
}

const Box3dBuilder: CoordsBuilder = (point, frame, value) => {
  const box3d = value?.Box3d;
  if (!box3d) {
    return {
      canBeFinished: false,
      isFinished: false,
      value: {
        [FieldType.BOX3D]: [
          {
            frame,
            value: {
              front: [point.x, point.y, 0, 0],
              side: null,
              sideType: null,
            },
          },
        ],
      },
      stage: Box3dBuilderStage.ONE_POINT,
    };
  }
  const [x, y] = box3d[0].value.front;
  return {
    canBeFinished: true,
    isFinished: true,
    value: {
      [FieldType.BOX3D]: [
        {
          frame,
          value: {
            front: [x, y, point.x, point.y],
            side: null,
            sideType: null,
          },
        },
      ],
    },
    stage: Box3dBuilderStage.TWO_POINTS,
  };
};

export default Box3dBuilder;

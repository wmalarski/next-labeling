import { CoordsBuilder, FieldType } from "../types";

export enum GraphBuilderStage {
  NO_POINTS = 0,
  ONE_POINT = 1,
}

const GraphBuilder: CoordsBuilder = (point, frame) => {
  return {
    canBeFinished: true,
    isFinished: true,
    value: {
      [FieldType.GRAPH]: [
        {
          value: {
            points: [{ ...point, n: 1 }],
            edges: [],
          },
          frame,
        },
      ],
    },
    stage: GraphBuilderStage.ONE_POINT,
  };
};

export default GraphBuilder;

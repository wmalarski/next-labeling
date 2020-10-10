import { FieldType } from "../../editors/types";
import { CoordsBuilder } from "../types";
import { Graphics } from "pixi.js";
import { PixiComponent } from "@inlet/react-pixi";
import { PixiInProgressObjectProps } from "../../../utils/vizualization/types";

export enum RectangleBuilderStage {
  NO_POINTS = 0,
  ONE_POINT = 1,
  TWO_POINTS = 2,
}

export const RectangleBuilder: CoordsBuilder = (point, value) => {
  if (!value?.Rectangle) {
    return {
      canBeFinished: false,
      isFinished: false,
      value: { [FieldType.RECTANGLE]: [point.x, point.y, 0, 0] },
      stage: RectangleBuilderStage.ONE_POINT,
    };
  }
  return {
    canBeFinished: true,
    isFinished: true,
    value: {
      [FieldType.RECTANGLE]: [
        value.Rectangle[0],
        value.Rectangle[1],
        point.x,
        point.y,
      ],
    },
    stage: RectangleBuilderStage.TWO_POINTS,
  };
};

export const RectangleInProgress = PixiComponent<
  PixiInProgressObjectProps,
  Graphics
>("RectangleInProgress", {
  create: () => new Graphics(),
  applyProps: (ins, _, props) => {
    const rectangle = props.value.Rectangle;
    const attributes = props.fieldSchema.attributes.Rectangle;
    // console.log({ rectangle });
    if (
      !rectangle ||
      !attributes ||
      props.stage < RectangleBuilderStage.TWO_POINTS
    )
      return;
    const [x1, y1, x2, y2] = rectangle;

    ins.x = x1;
    ins.beginFill(0xff0000);
    ins.drawRect(x1, y1, x2 - x1, y2 - y1);
    ins.endFill();
  },
});

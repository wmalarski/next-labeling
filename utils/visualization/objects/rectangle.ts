import { FieldType } from "../../editors/types";
import {
  CoordsBuilder,
  FinishedObjectProps,
  InProgressObjectProps,
} from "../types";
import { Graphics } from "pixi.js";
import { PixiComponent } from "@inlet/react-pixi";
import { getFieldValue } from "../../editors/functions";

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

export const RectangleInProgress = PixiComponent<
  InProgressObjectProps,
  Graphics
>("RectangleInProgress", {
  create: () => new Graphics(),
  applyProps: (ins, _, props) => {
    const rectangle = props.value.Rectangle;
    if (!rectangle) return;
    const value = rectangle[0].value;
    if (!value || props.stage < RectangleBuilderStage.ONE_POINT) return;
    const [x1, y1, x2, y2] = value;

    ins.x = x1;
    ins.beginFill(0xff0000);
    ins.drawRect(x1, y1, x2 - x1, y2 - y1);
    ins.endFill();
  },
});

export const RectangleFinished = PixiComponent<FinishedObjectProps, Graphics>(
  "RectangleFinished",
  {
    create: () => new Graphics(),
    applyProps: (ins, _, props) => {
      const { frame, field } = props;
      const values = getFieldValue({
        perFrame: field.fieldSchema.perFrame,
        values: field.values,
        frame,
      })?.Rectangle;
      if (!values || !values[0].value) return;
      const [x1, y1, x2, y2] = values[0].value;

      ins.x = x1;
      ins.beginFill(0xff0000);
      ins.drawRect(x1, y1, x2 - x1, y2 - y1);
      ins.endFill();
    },
  },
);

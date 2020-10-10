import { Graphics } from "pixi.js";
import { PixiComponent } from "@inlet/react-pixi";
import { RectangleBuilderStage } from "../../../utils/vizualization/coordsBuilders";
import { PixiObjectProps } from "../../../utils/vizualization/types";

const Rectangle = PixiComponent<PixiObjectProps, Graphics>("Rectangle", {
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

export default Rectangle;

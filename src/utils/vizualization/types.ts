import { LabelingFieldValue } from "../editors/types";
import { FieldSchema } from "../schema/types";

export interface PixiObjectProps {
  stage: number;
  isFinished: boolean;
  canBeFinished: boolean;
  fieldSchema: FieldSchema;
  value: LabelingFieldValue;
}

export enum MouseButton {
  LEFT = 0,
  MIDDLE = 1,
  RIGHT = 2,
}

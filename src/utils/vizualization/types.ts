import { LabelingFieldValue } from "../editors/types";
import { ExtendedObject } from "../labeling/types";
import { FieldSchema } from "../schema/types";

export interface PixiInProgressObjectProps {
  stage: number;
  fieldSchema: FieldSchema;
  value: LabelingFieldValue;
  object: ExtendedObject;
}

export interface PixiFinishedObjectProps {
  fieldSchema: FieldSchema;
  value: LabelingFieldValue;
  object: ExtendedObject;
}

export enum MouseButton {
  LEFT = 0,
  MIDDLE = 1,
  RIGHT = 2,
}

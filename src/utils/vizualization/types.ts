import { LabelingFieldValue } from "../editors/types";
import { ExtendedObject } from "../labeling/types";
import { FieldSchema } from "../schema/types";

export interface CoordsBuilderResult {
  stage: number;
  value?: LabelingFieldValue;
  isFinished: boolean;
  canBeFinished: boolean;
}

export type CoordsBuilder = (
  point: PIXI.Point,
  value?: LabelingFieldValue,
) => CoordsBuilderResult | undefined;

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

import { LabelingFieldValues } from "../editors/types";
import { LabelingField, LabelingObject } from "../labeling/types/client";
import { FieldSchema } from "../schema/types";

export interface CoordsBuilderResult {
  stage: number;
  value?: LabelingFieldValues;
  isFinished: boolean;
  canBeFinished: boolean;
}

export type CoordsBuilder = (
  point: PIXI.Point,
  frame: number,
  value?: LabelingFieldValues,
) => CoordsBuilderResult | undefined;

export interface PixiInProgressObjectProps {
  stage: number;
  fieldSchema: FieldSchema;
  value: LabelingFieldValues;
  object: LabelingObject;
}

export interface PixiFinishedObjectProps {
  isSelected: boolean;
  field: LabelingField;
  frame: number;
  object: LabelingObject;
}

export enum ToolType {
  SELECTOR,
  ZOOM_AND_PANE,
  DRAWING_TOOL,
}

export enum MouseButton {
  LEFT = 0,
  MIDDLE = 1,
  RIGHT = 2,
}

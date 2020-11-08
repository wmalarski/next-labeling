import { LabelingField, LabelingObject } from "../labeling/types/client";

export interface ObjectBlock {
  firstFrame: number;
  lastFrame: number;
}

export interface FieldBlock {
  firstFrame: number;
  lastFrame: number;
  value: string;
  index: number;
}

export interface TimelineObjectShapeConfig {
  row: number;
  isToggled: boolean;
  object: LabelingObject;
  objectBlocks: ObjectBlock[];
  fieldBlocks: {
    field: LabelingField;
    fieldBlocks: FieldBlock[];
  }[];
}

import Konva from "konva";
import { LabelingObject } from "../labeling/types/client";
import { SelectedStrokeWidth, UnselectedStrokeWidth } from "./constansts";

export function getShapeStyle(isSelected: boolean): Konva.ShapeConfig {
  return {
    strokeScaleEnabled: false,
    strokeWidth: isSelected ? SelectedStrokeWidth : UnselectedStrokeWidth,
  };
}

export function getLabelText(object: LabelingObject): string {
  return object.name;
}

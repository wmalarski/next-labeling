import React from "react";
import { FieldEditorProps, FieldType } from "../../utils/editors/types";

type ShapeTypes =
  | FieldType.LINE
  | FieldType.RECTANGLE
  | FieldType.POINT
  | FieldType.POLYGON;

export default function ShapeEditor(
  props: FieldEditorProps<ShapeTypes>,
): JSX.Element {
  const { disabled, frame, values, attributes, onChange } = props;
  return <></>;
}

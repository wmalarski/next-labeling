import { Button } from "@material-ui/core";
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
  const { disabled } = props;
  // TODO: send signal to context - select tool and start drawing
  return (
    <Button disabled={disabled} color="inherit" size="small">
      Draw shape
    </Button>
  );
}

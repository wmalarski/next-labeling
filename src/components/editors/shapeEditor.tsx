import { Button } from "@material-ui/core";
import React from "react";

import { FieldEditorProps } from "../../utils/editors/types";

export default function ShapeEditor(props: FieldEditorProps): JSX.Element {
  const { disabled } = props;
  // TODO: send signal to context - select tool and start drawing #6
  return (
    <Button disabled={disabled} color="inherit" size="small">
      Draw shape
    </Button>
  );
}

import TextField from "@material-ui/core/TextField";
import React from "react";

import {
  calculateNewValues,
  getFieldValue,
} from "../../utils/editors/functions";
import { FieldEditorProps, FieldType } from "../../utils/editors/types";

export default function TextEditor(
  props: FieldEditorProps<FieldType.TEXT>,
): JSX.Element {
  const { disabled, name, perFrame, frame, onChange } = props;
  const fieldValue = getFieldValue(props);
  const type = FieldType.TEXT;
  return fieldValue ? (
    <TextField
      label={name}
      disabled={disabled}
      fullWidth
      variant="outlined"
      value={fieldValue.value}
      onChange={event => {
        const value = event.target.value;
        onChange(values => ({
          [type]: calculateNewValues<typeof type>(values[type], perFrame, {
            frame,
            value,
          }),
        }));
      }}
    />
  ) : (
    <></>
  );
}

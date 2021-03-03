import TextField from "@material-ui/core/TextField";
import React from "react";
import { getFieldValues } from "../functions";
import { FieldEditorProps, FieldType } from "../types";

export default function TextEditor(
  props: FieldEditorProps,
): JSX.Element | null {
  const { disabled, field, frame, onChange } = props;

  const frameValue = getFieldValues({
    frame,
    perFrame: field.fieldSchema.perFrame,
    values: field.values,
  })?.Text?.[0];

  if (!frameValue) return null;

  return (
    <TextField
      label={field.fieldSchema.name}
      disabled={disabled}
      fullWidth
      variant="outlined"
      value={frameValue.value}
      onChange={event => {
        onChange({
          [FieldType.TEXT]: [
            {
              frame,
              value: event.target.value as string,
            },
          ],
        });
      }}
    />
  );
}

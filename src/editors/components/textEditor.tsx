import TextField from "@material-ui/core/TextField";
import React from "react";
import { getFieldValues } from "../functions";
import { FieldEditorProps, FieldType } from "../types";

export default function TextEditor(
  props: FieldEditorProps,
): JSX.Element | null {
  const { disabled, field, frame, onChange } = props;

  const frameValues = getFieldValues({
    frame,
    perFrame: field.fieldSchema.perFrame,
    values: field.values,
  })?.Text;
  if (!frameValues) return null;
  const frameValue = frameValues[0];

  return frameValue ? (
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
  ) : null;
}

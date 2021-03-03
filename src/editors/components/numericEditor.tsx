import TextField from "@material-ui/core/TextField";
import React from "react";
import { getFieldValues } from "../functions";
import { FieldEditorProps, FieldType } from "../types";

export default function NumericEditor(
  props: FieldEditorProps,
): JSX.Element | null {
  const { disabled, field, frame, onChange } = props;

  const config = field.fieldSchema.attributes.Numeric;

  const frameValue = getFieldValues({
    frame,
    perFrame: field.fieldSchema.perFrame,
    values: field.values,
  })?.Numeric?.[0];

  if (!frameValue || !config) return null;

  return (
    <TextField
      label={field.fieldSchema.name}
      disabled={disabled}
      fullWidth
      type="number"
      variant="outlined"
      value={frameValue.value}
      inputProps={{
        max: config.max,
        min: config.min,
        step: config.step,
      }}
      onChange={event =>
        onChange({
          [FieldType.NUMERIC]: [
            {
              frame,
              value: Number(event.target.value),
            },
          ],
        })
      }
    />
  );
}

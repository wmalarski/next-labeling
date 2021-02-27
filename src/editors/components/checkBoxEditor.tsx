import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import React from "react";
import { getFieldValues } from "../functions";
import { FieldEditorProps, FieldType } from "../types";

export default function CheckBoxEditor(
  props: FieldEditorProps,
): JSX.Element | null {
  const { disabled, field, frame, onChange } = props;

  const frameValues = getFieldValues({
    frame,
    perFrame: field.fieldSchema.perFrame,
    values: field.values,
  })?.CheckBox;
  if (!frameValues) return null;
  const frameValue = frameValues[0];

  return frameValue ? (
    <FormControlLabel
      control={
        <Checkbox
          disabled={disabled}
          checked={frameValue.value}
          onChange={event =>
            onChange({
              [FieldType.CHECKBOX]: [
                {
                  frame,
                  value: event.target.checked,
                },
              ],
            })
          }
        />
      }
      label={field.fieldSchema.name}
    />
  ) : null;
}

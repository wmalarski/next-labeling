import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import { GridSize } from "@material-ui/core/Grid/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import ToggleButton from "@material-ui/lab/ToggleButton";
import React from "react";
import { getFieldValues } from "../functions";
import { FieldEditorProps, FieldType } from "../types";

export default function SelectEditor(
  props: FieldEditorProps,
): JSX.Element | null {
  const { disabled, field, frame, onChange } = props;

  const config = field.fieldSchema.attributes.Select;
  const frameValue = getFieldValues({
    frame,
    perFrame: field.fieldSchema.perFrame,
    values: field.values,
  })?.Select?.[0];

  if (!frameValue || !config) return null;

  return (
    <FormControl>
      <InputLabel id="select-field-type-label">
        {field.fieldSchema.name}
      </InputLabel>
      <Grid container spacing={1}>
        {config.options.map(option => (
          <Grid
            item
            key={option.text}
            xs={Math.min(Math.max(1, option.size), 12) as GridSize}
          >
            <ToggleButton
              disabled={disabled}
              value={option.text}
              selected={frameValue.value === option.text}
              size="small"
              color="inherit"
              onChange={() =>
                onChange({
                  [FieldType.SELECT]: [
                    {
                      frame,
                      value: option.text,
                    },
                  ],
                })
              }
            >
              {option.text}
            </ToggleButton>
          </Grid>
        ))}
      </Grid>
    </FormControl>
  );
}

import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import { GridSize } from "@material-ui/core/Grid/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import ToggleButton from "@material-ui/lab/ToggleButton/ToggleButton";
import React from "react";
import { getFieldValues } from "../functions";
import { FieldEditorProps, FieldType } from "../types";

export default function MultiSelectEditor(
  props: FieldEditorProps,
): JSX.Element | null {
  const { disabled, frame, field, onChange } = props;

  const config = field.fieldSchema.attributes.MultiSelect;

  const frameValue = getFieldValues({
    frame,
    perFrame: field.fieldSchema.perFrame,
    values: field.values,
  })?.MultiSelect?.[0];

  if (!frameValue || !config) return null;

  const selected = frameValue?.value ?? [];

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
              selected={selected.includes(option.text)}
              value={option.text}
              size="small"
              color="inherit"
              onChange={() => {
                const textIndex = selected.indexOf(option.text);
                if (textIndex === -1) {
                  onChange({
                    [FieldType.MULSELECT]: [
                      {
                        frame,
                        value: [...selected, option.text],
                      },
                    ],
                  });
                }
                const newSelected = [...selected];
                newSelected.splice(textIndex, 1);
                onChange({
                  [FieldType.MULSELECT]: [
                    {
                      frame,
                      value: newSelected,
                    },
                  ],
                });
              }}
            >
              {option.text}
            </ToggleButton>
          </Grid>
        ))}
      </Grid>
    </FormControl>
  );
}

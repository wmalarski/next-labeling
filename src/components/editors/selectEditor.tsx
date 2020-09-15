import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import { GridSize } from "@material-ui/core/Grid/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import ToggleButton from "@material-ui/lab/ToggleButton";
import React from "react";

import {
  calculateNewValues,
  getFieldValue,
} from "../../utils/editors/functions";
import { FieldEditorProps, FieldType } from "../../utils/editors/types";

export default function SelectEditor(
  props: FieldEditorProps<FieldType.SELECT>,
): JSX.Element {
  const { disabled, frame, perFrame, attributes, onChange } = props;
  const config = attributes.Select;
  const fieldValue = getFieldValue(props);
  const selected = fieldValue?.value;
  const type = FieldType.SELECT;

  return fieldValue && config ? (
    <FormControl>
      <InputLabel id="select-field-type-label">{name}</InputLabel>
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
              selected={selected === option.text}
              size="small"
              color="inherit"
              onChange={() =>
                onChange(values => ({
                  [type]: calculateNewValues<typeof type>(
                    values[type],
                    perFrame,
                    {
                      frame,
                      value: option.text,
                    },
                  ),
                }))
              }
            >
              {option.text}
            </ToggleButton>
          </Grid>
        ))}
      </Grid>
    </FormControl>
  ) : (
    <></>
  );
}

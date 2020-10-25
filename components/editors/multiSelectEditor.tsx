import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import { GridSize } from "@material-ui/core/Grid/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import ToggleButton from "@material-ui/lab/ToggleButton/ToggleButton";
import React from "react";

import {
  calculateNewValues,
  getFieldValues,
} from "../../utils/editors/functions";
import { FieldEditorProps, FieldType } from "../../utils/editors/types";
import usePreferences from "../../utils/labeling/hooks/usePreferencesContext";

export default function MultiSelectEditor(
  props: FieldEditorProps,
): JSX.Element {
  const { disabled, frame, perFrame, attributes, onChange } = props;
  const { preferences } = usePreferences();
  const config = attributes.MultiSelect;

  const frameValues = getFieldValues(props)?.MultiSelect;
  if (!frameValues) return <></>;
  const frameValue = frameValues[0];
  const selected = frameValue?.value ?? [];

  return frameValue && config ? (
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
              selected={selected.includes(option.text)}
              value={option.text}
              size="small"
              color="inherit"
              onChange={() =>
                onChange(values => {
                  const textIndex = selected.indexOf(option.text);
                  if (textIndex === -1) {
                    return calculateNewValues(
                      values,
                      perFrame,
                      {
                        [FieldType.MULSELECT]: [
                          {
                            frame,
                            value: [...selected, option.text],
                          },
                        ],
                      },
                      preferences.labelingDirection,
                    );
                  }
                  const newSelected = [...selected];
                  newSelected.splice(textIndex, 1);
                  return calculateNewValues(
                    values,
                    perFrame,
                    {
                      [FieldType.MULSELECT]: [
                        {
                          frame,
                          value: newSelected,
                        },
                      ],
                    },
                    preferences.labelingDirection,
                  );
                })
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

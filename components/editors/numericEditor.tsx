import TextField from "@material-ui/core/TextField";
import React from "react";

import {
  calculateNewValues,
  getFieldValues,
} from "../../utils/editors/functions";
import { FieldEditorProps, FieldType } from "../../utils/editors/types";
import usePreferences from "../../utils/labeling/hooks/usePreferencesContext";

export default function NumericEditor(props: FieldEditorProps): JSX.Element {
  const { disabled, name, perFrame, frame, attributes, onChange } = props;
  const { preferences } = usePreferences();
  const config = attributes.Numeric;

  const frameValues = getFieldValues(props)?.Numeric;
  if (!frameValues) return <></>;
  const frameValue = frameValues[0];

  return frameValue && config ? (
    <TextField
      label={name}
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
      onChange={event => {
        const value = Number(event.target.value);
        onChange(values =>
          calculateNewValues(
            values,
            perFrame,
            {
              [FieldType.NUMERIC]: [
                {
                  frame,
                  value,
                },
              ],
            },
            preferences.labelingDirection,
          ),
        );
      }}
    />
  ) : (
    <></>
  );
}
import TextField from "@material-ui/core/TextField";
import React from "react";
import {
  calculateNewValues,
  getFieldValue,
} from "../../utils/editors/functions";
import { FieldEditorProps, FieldType } from "../../utils/editors/types";

export default function NumericEditor(
  props: FieldEditorProps<FieldType.NUMERIC>,
): JSX.Element {
  const { disabled, name, perFrame, frame, onChange } = props;
  const fieldValue = getFieldValue(props);
  const type = FieldType.NUMERIC;
  return fieldValue ? (
    <TextField
      label={name}
      disabled={disabled}
      fullWidth
      type="number"
      variant="outlined"
      value={fieldValue.value}
      onChange={event => {
        const value = Number(event.target.value);
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

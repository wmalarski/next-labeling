import TextField from "@material-ui/core/TextField";
import React from "react";

import {
  calculateNewValues,
  getFieldValue,
} from "../../utils/editors/functions";
import { FieldEditorProps, FieldType } from "../../utils/editors/types";

export default function TextEditor(props: FieldEditorProps): JSX.Element {
  const { disabled, name, perFrame, frame, onChange } = props;

  const frameValues = getFieldValue(props)?.Text;
  if (!frameValues) return <></>;
  const frameValue = frameValues[0];

  return frameValue ? (
    <TextField
      label={name}
      disabled={disabled}
      fullWidth
      variant="outlined"
      value={frameValue.value}
      onChange={event => {
        const value = event.target.value;
        onChange(values =>
          calculateNewValues(values, perFrame, {
            [FieldType.TEXT]: [
              {
                frame,
                value,
              },
            ],
          }),
        );
      }}
    />
  ) : (
    <></>
  );
}

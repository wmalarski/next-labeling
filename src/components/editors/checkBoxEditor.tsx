import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import React from "react";

import {
  calculateNewValues,
  getFieldValue,
} from "../../utils/editors/functions";
import { FieldEditorProps, FieldType } from "../../utils/editors/types";

export default function CheckBoxEditor(
  props: FieldEditorProps<FieldType.CHECKBOX>,
): JSX.Element {
  const { disabled, name, perFrame, frame, onChange } = props;
  const fieldValue = getFieldValue(props);
  const type = FieldType.CHECKBOX;
  return fieldValue ? (
    <FormControlLabel
      control={
        <Checkbox
          disabled={disabled}
          checked={fieldValue.value}
          onChange={event => {
            const checked = event.target.checked;
            onChange(values => ({
              [type]: calculateNewValues<typeof type>(values[type], perFrame, {
                frame,
                value: checked,
              }),
            }));
          }}
        />
      }
      label={name}
    />
  ) : (
    <></>
  );
}

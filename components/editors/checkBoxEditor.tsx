import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import React from "react";

import {
  calculateNewValues,
  getFieldValue,
} from "../../utils/editors/functions";
import { FieldEditorProps, FieldType } from "../../utils/editors/types";
import usePreferences from "../../utils/labeling/hooks/usePreferencesContext";

export default function CheckBoxEditor(props: FieldEditorProps): JSX.Element {
  const { disabled, name, perFrame, frame, onChange } = props;
  const { preferences } = usePreferences();

  const frameValues = getFieldValue(props)?.CheckBox;
  if (!frameValues) return <></>;
  const frameValue = frameValues[0];

  return frameValue ? (
    <FormControlLabel
      control={
        <Checkbox
          disabled={disabled}
          checked={frameValue.value}
          onChange={event => {
            const checked = event.target.checked;
            onChange(values =>
              calculateNewValues(
                values,
                perFrame,
                {
                  [FieldType.CHECKBOX]: [
                    {
                      frame,
                      value: checked,
                    },
                  ],
                },
                preferences.labelingDirection,
              ),
            );
          }}
        />
      }
      label={name}
    />
  ) : (
    <></>
  );
}

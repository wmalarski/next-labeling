import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import React from "react";
import usePreferences from "../../workspace/hooks/usePreferencesContext";
import { calculateNewValues, getFieldValues } from "../functions";
import { FieldEditorProps, FieldType } from "../types";

export default function ComboBoxEditor(props: FieldEditorProps): JSX.Element {
  const { disabled, name, perFrame, frame, attributes, onChange } = props;
  const { preferences } = usePreferences();
  const config = attributes.ComboBox;

  const frameValues = getFieldValues(props)?.ComboBox;
  if (!frameValues) return <></>;
  const frameValue = frameValues[0];

  return frameValue && config ? (
    <FormControl fullWidth>
      <InputLabel id="select-field-type-label">{name}</InputLabel>
      <Select
        disabled={disabled}
        labelId="select-field-type-label"
        id="select-field-type"
        value={frameValue.value}
        fullWidth
        onChange={event => {
          const newText = event.target.value as string;
          onChange(values =>
            calculateNewValues(
              values,
              perFrame,
              {
                [FieldType.COMBOBOX]: [
                  {
                    frame,
                    value: newText,
                  },
                ],
              },
              preferences.labelingDirection,
            ),
          );
        }}
      >
        {config.options.map(
          (name): JSX.Element => (
            <MenuItem value={name} key={name}>
              {name}
            </MenuItem>
          ),
        )}
      </Select>
    </FormControl>
  ) : (
    <></>
  );
}

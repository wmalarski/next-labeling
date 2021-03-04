import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import React from "react";
import { getFieldValues } from "../functions";
import { FieldEditorProps, FieldType } from "../types";

export default function ComboBoxEditor(
  props: FieldEditorProps,
): JSX.Element | null {
  const { disabled, field, frame, onChange } = props;

  const config = field.fieldSchema.attributes.ComboBox;
  const frameValue = getFieldValues({
    frame,
    perFrame: field.fieldSchema.perFrame,
    values: field.values,
  })?.ComboBox?.[0];

  if (!frameValue || !config) return null;

  return (
    <FormControl fullWidth>
      <InputLabel id="select-field-type-label">
        {field.fieldSchema.name}
      </InputLabel>
      <Select
        disabled={disabled}
        labelId="select-field-type-label"
        id="select-field-type"
        value={frameValue.value}
        fullWidth
        onChange={event =>
          onChange({
            [FieldType.COMBOBOX]: [
              {
                frame,
                value: event.target.value as string,
              },
            ],
          })
        }
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
  );
}

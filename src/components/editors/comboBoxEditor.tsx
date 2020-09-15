import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import React from "react";
import {
  calculateNewValues,
  getFieldValue,
} from "../../utils/editors/functions";
import { FieldEditorProps, FieldType } from "../../utils/editors/types";

export default function ComboBoxEditor(
  props: FieldEditorProps<FieldType.COMBOBOX>,
): JSX.Element {
  const { disabled, name, perFrame, frame, attributes, onChange } = props;
  const fieldValue = getFieldValue(props);
  const type = FieldType.CHECKBOX;
  return fieldValue && attributes ? (
    <FormControl>
      <InputLabel id="select-field-type-label">{name}</InputLabel>
      <Select
        disabled={disabled}
        labelId="select-field-type-label"
        id="select-field-type"
        value={type}
        fullWidth
        onChange={event => {
          const newText = event.target.value;
          onChange(values => ({
            [type]: calculateNewValues<typeof type>(values[type], perFrame, {
              frame,
              value: newText,
            }),
          }));
        }}
      >
        {attributes.options.map(
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

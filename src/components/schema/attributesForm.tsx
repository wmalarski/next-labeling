import React from "react";
import { FieldType, LabelingFieldAttributes } from "../../utils/schema/fields";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { CompactPicker } from "react-color";
import ComboBoxForm from "./comboBoxForm";
import SelectForm from "./selectForm";
import MulSelectForm from "./mulSelectForm";

export interface AttributesFormProps {
  type: FieldType;
  attributes: LabelingFieldAttributes[FieldType];
  onChange: (attributes: LabelingFieldAttributes[FieldType]) => void;
}

export default function AttributesForm(
  props: AttributesFormProps
): JSX.Element {
  const { type, attributes, onChange } = props;

  switch (type) {
    case FieldType.LINE:
    case FieldType.POINT:
    case FieldType.POLYGON:
    case FieldType.RECTANGLE:
      const colorAttributes = attributes as LabelingFieldAttributes[typeof type];
      return (
        <CompactPicker
          color={colorAttributes.color}
          onChangeComplete={(color) => onChange({ color: color.hex })}
        />
      );
    case FieldType.CHECKBOX:
      const checkBoxAttributes = attributes as LabelingFieldAttributes[typeof type];
      return (
        <FormControlLabel
          control={
            <Checkbox
              checked={checkBoxAttributes.default}
              onChange={(event) => onChange({ default: event.target.checked })}
            />
          }
          label="Default value"
        />
      );
    case FieldType.TEXT:
      const textAttributes = attributes as LabelingFieldAttributes[typeof type];
      return (
        <TextField
          label="Default"
          variant="outlined"
          margin="dense"
          fullWidth
          value={textAttributes.default}
          onChange={(event) => onChange({ default: event.target.value })}
        />
      );
    case FieldType.NUMBER:
      const numberAttributes = attributes as LabelingFieldAttributes[typeof type];
      return (
        <>
          <TextField
            label="Default"
            type="number"
            margin="dense"
            fullWidth
            value={numberAttributes.default}
            onChange={(event) =>
              onChange({
                ...numberAttributes,
                default: Number(event.target.value),
              })
            }
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Min"
            type="number"
            margin="dense"
            fullWidth
            value={numberAttributes.min}
            onChange={(event) =>
              onChange({ ...numberAttributes, min: Number(event.target.value) })
            }
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Max"
            type="number"
            margin="dense"
            fullWidth
            value={numberAttributes.max}
            onChange={(event) =>
              onChange({ ...numberAttributes, max: Number(event.target.value) })
            }
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Step"
            type="number"
            margin="dense"
            fullWidth
            value={numberAttributes.step}
            onChange={(event) =>
              onChange({
                ...numberAttributes,
                step: Number(event.target.value),
              })
            }
            InputLabelProps={{
              shrink: true,
            }}
          />
        </>
      );
    case FieldType.COMBOBOX:
      const comboBoxAttributes = attributes as LabelingFieldAttributes[typeof type];
      return (
        <ComboBoxForm attributes={comboBoxAttributes} onChange={onChange} />
      );
    case FieldType.SELECT:
      const selectAttributes = attributes as LabelingFieldAttributes[typeof type];
      return <SelectForm attributes={selectAttributes} onChange={onChange} />;
    case FieldType.MULSELECT:
      const multiselectAttributes = attributes as LabelingFieldAttributes[typeof type];
      return (
        <MulSelectForm attributes={multiselectAttributes} onChange={onChange} />
      );
    default:
      return <></>;
  }
}

import React, { memo } from "react";
import { FieldType, LabelingFieldAttributes } from "../../utils/schema/fields";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { CompactPicker } from "react-color";
import ComboBoxForm from "./comboBoxForm";
import SelectForm from "./selectForm";
import MulSelectForm from "./mulSelectForm";

export type OnChangeHandler<T extends keyof LabelingFieldAttributes> = (
  provider: (
    attributes: LabelingFieldAttributes[T]
  ) => LabelingFieldAttributes[T] | undefined
) => void;

export interface AttributesFormProps {
  type: FieldType;
  attributes: LabelingFieldAttributes[FieldType];
  onChange: OnChangeHandler<FieldType>;
}

function AttributesFormPrivate(props: AttributesFormProps): JSX.Element {
  const { type, attributes, onChange } = props;

  switch (type) {
    case FieldType.LINE:
    case FieldType.POINT:
    case FieldType.POLYGON:
    case FieldType.RECTANGLE:
      const colorAttributes = attributes as LabelingFieldAttributes[typeof type];
      const colorOnChange = onChange as OnChangeHandler<typeof type>;
      return (
        <CompactPicker
          color={colorAttributes.color}
          onChangeComplete={(color) => {
            const hex = color.hex;
            colorOnChange(() => ({ color: hex }));
          }}
        />
      );
    case FieldType.CHECKBOX:
      const checkBoxAttributes = attributes as LabelingFieldAttributes[typeof type];
      const checkBoxOnChange = onChange as OnChangeHandler<typeof type>;
      return (
        <FormControlLabel
          control={
            <Checkbox
              checked={checkBoxAttributes.default}
              onChange={(event) => {
                const checked = event.target.checked;
                checkBoxOnChange(() => ({ default: checked }));
              }}
            />
          }
          label="Default value"
        />
      );
    case FieldType.TEXT:
      const textAttributes = attributes as LabelingFieldAttributes[typeof type];
      const textOnChange = onChange as OnChangeHandler<typeof type>;
      return (
        <TextField
          label="Default"
          variant="outlined"
          margin="dense"
          fullWidth
          value={textAttributes.default}
          onChange={(event) => {
            const text = event.target.value;
            textOnChange(() => ({ default: text }));
          }}
        />
      );
    case FieldType.NUMBER:
      const numberAttributes = attributes as LabelingFieldAttributes[typeof type];
      const numberOnChange = onChange as OnChangeHandler<typeof type>;
      return (
        <>
          <TextField
            label="Default"
            type="number"
            margin="dense"
            fullWidth
            value={numberAttributes.default}
            onChange={(event) => {
              const defaultNumber = event.target.value;
              numberOnChange((attributes) => ({
                ...attributes,
                default: Number(defaultNumber),
              }));
            }}
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
            onChange={(event) => {
              const min = event.target.value;
              numberOnChange((attributes) => ({
                ...attributes,
                min: Number(min),
              }));
            }}
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
            onChange={(event) => {
              const max = event.target.value;
              numberOnChange((attributes) => ({
                ...attributes,
                max: Number(max),
              }));
            }}
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
            onChange={(event) => {
              const step = event.target.value;
              numberOnChange((attributes) => ({
                ...attributes,
                step: Number(step),
              }));
            }}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </>
      );
    case FieldType.COMBOBOX:
      const comboBoxAttributes = attributes as LabelingFieldAttributes[typeof type];
      const comboBoxOnChange = onChange as OnChangeHandler<typeof type>;
      return (
        <ComboBoxForm
          attributes={comboBoxAttributes}
          onChange={comboBoxOnChange}
        />
      );
    case FieldType.SELECT:
      const selectAttributes = attributes as LabelingFieldAttributes[typeof type];
      const selectOnChange = onChange as OnChangeHandler<typeof type>;
      return (
        <SelectForm attributes={selectAttributes} onChange={selectOnChange} />
      );
    case FieldType.MULSELECT:
      const multiselectAttributes = attributes as LabelingFieldAttributes[typeof type];
      const multiselectOnChange = onChange as OnChangeHandler<typeof type>;
      return (
        <MulSelectForm
          attributes={multiselectAttributes}
          onChange={multiselectOnChange}
        />
      );
    default:
      return <></>;
  }
}

const AttributesForm = memo(
  AttributesFormPrivate,
  (
    { attributes: prevAttributes, type: prevType },
    { attributes: nextAttributes, type: nextType }
  ) =>
    prevType === nextType &&
    JSON.stringify(prevAttributes) === JSON.stringify(nextAttributes)
);

export default AttributesForm;

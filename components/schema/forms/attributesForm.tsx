import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TextField from "@material-ui/core/TextField";
import React, { memo } from "react";
import { CompactPicker } from "react-color";

import {
  FieldType,
  LabelingFieldAttributes,
  OnAttributeChangeHandler,
} from "../../../utils/editors/types";
import ComboBoxForm from "./comboBoxForm";
import MulSelectForm from "./mulSelectForm";
import NumericForm from "./numericForm";
import SelectForm from "./selectForm";

export interface AttributesFormProps {
  attributes: LabelingFieldAttributes;
  onChange: OnAttributeChangeHandler;
}

function AttributesFormPrivate(props: AttributesFormProps): JSX.Element {
  const { attributes: attributesObject, onChange } = props;
  const keys = Object.keys(attributesObject);
  const type = keys[0];

  switch (type) {
    case FieldType.LINE:
    case FieldType.POINT:
    case FieldType.POLYGON:
    case FieldType.BOX3D:
    case FieldType.EYE:
    case FieldType.GRAPH:
    case FieldType.RECTANGLE: {
      const colorAttributes = attributesObject[type];
      return colorAttributes ? (
        <CompactPicker
          color={colorAttributes.color}
          onChangeComplete={color => {
            const hex = color.hex;
            onChange(() => ({ [type]: { color: hex } }));
          }}
        />
      ) : (
        <></>
      );
    }
    case FieldType.CHECKBOX: {
      const checkBoxAttributes = attributesObject[type];
      return checkBoxAttributes ? (
        <FormControlLabel
          control={
            <Checkbox
              checked={checkBoxAttributes.default}
              onChange={event => {
                const checked = event.target.checked;
                onChange(() => ({ [type]: { default: checked } }));
              }}
            />
          }
          label="Default value"
        />
      ) : (
        <></>
      );
    }
    case FieldType.TEXT: {
      const textAttributes = attributesObject[type];
      return textAttributes ? (
        <TextField
          label="Default"
          variant="outlined"
          margin="dense"
          fullWidth
          value={textAttributes.default}
          onChange={event => {
            const text = event.target.value;
            onChange(() => ({ [type]: { default: text } }));
          }}
        />
      ) : (
        <></>
      );
    }
    case FieldType.NUMERIC: {
      const numberAttributes = attributesObject[type];
      return numberAttributes ? (
        <NumericForm attributes={numberAttributes} onChange={onChange} />
      ) : (
        <></>
      );
    }
    case FieldType.COMBOBOX: {
      const comboBoxAttributes = attributesObject[type];
      return comboBoxAttributes ? (
        <ComboBoxForm attributes={comboBoxAttributes} onChange={onChange} />
      ) : (
        <></>
      );
    }
    case FieldType.SELECT: {
      const selectAttributes = attributesObject[type];
      return selectAttributes ? (
        <SelectForm attributes={selectAttributes} onChange={onChange} />
      ) : (
        <></>
      );
    }
    case FieldType.MULSELECT: {
      const multiselectAttributes = attributesObject[type];
      return multiselectAttributes ? (
        <MulSelectForm attributes={multiselectAttributes} onChange={onChange} />
      ) : (
        <></>
      );
    }
    default:
      return <></>;
  }
}

const AttributesForm = memo(
  AttributesFormPrivate,
  ({ attributes: prevAttributes }, { attributes: nextAttributes }) =>
    JSON.stringify(prevAttributes) === JSON.stringify(nextAttributes),
);

export default AttributesForm;

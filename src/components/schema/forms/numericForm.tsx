import TextField from "@material-ui/core/TextField";
import React from "react";

import {
  FieldType,
  NumberAttributes,
  OnAttributeChangeHandler,
} from "../../../utils/editors/types";

export interface NumberFormProps {
  attributes: NumberAttributes;
  onChange: OnAttributeChangeHandler;
}

export default function NumericForm(props: NumberFormProps): JSX.Element {
  const { attributes: numberAttributes, onChange } = props;
  return (
    <>
      <TextField
        label="Default"
        type="number"
        margin="dense"
        fullWidth
        value={numberAttributes.default}
        onChange={event => {
          const defaultNumber = event.target.value;
          onChange(attributes => {
            if (!attributes.Numeric) return;
            return {
              [FieldType.NUMERIC]: {
                ...attributes.Numeric,
                default: Number(defaultNumber),
              },
            };
          });
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
        onChange={event => {
          const min = event.target.value;
          onChange(attributes => {
            if (!attributes.Numeric) return;
            return {
              [FieldType.NUMERIC]: {
                ...attributes.Numeric,
                min: Number(min),
              },
            };
          });
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
        onChange={event => {
          const max = event.target.value;
          onChange(attributes => {
            if (!attributes.Numeric) return;
            return {
              [FieldType.NUMERIC]: {
                ...attributes.Numeric,
                max: Number(max),
              },
            };
          });
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
        onChange={event => {
          const step = event.target.value;
          onChange(attributes => {
            if (!attributes.Numeric) return;
            return {
              [FieldType.NUMERIC]: {
                ...attributes.Numeric,
                step: Number(step),
              },
            };
          });
        }}
        InputLabelProps={{
          shrink: true,
        }}
      />
    </>
  );
}

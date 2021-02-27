import Typography from "@material-ui/core/Typography";
import React from "react";
import { getFieldValues } from "../functions";
import { FieldEditorProps, FieldType } from "../types";
import CheckBoxEditor from "./checkBoxEditor";
import ComboBoxEditor from "./comboBoxEditor";
import MultiSelectEditor from "./multiSelectEditor";
import NumericEditor from "./numericEditor";
import SelectEditor from "./selectEditor";
import TextEditor from "./textEditor";

function DefaultEditor(props: FieldEditorProps): JSX.Element | null {
  const { field, frame } = props;

  const frameValues = getFieldValues({
    frame,
    perFrame: field.fieldSchema.perFrame,
    values: field.values,
  });
  const frameValue = Object.values(frameValues ?? {})[0];
  if (!frameValue) return null;
  const value = frameValue[0].value;
  return (
    frameValue && (
      <>
        <Typography variant="overline">{field.fieldSchema.name}</Typography>
        <Typography>{JSON.stringify(value, null, 2)}</Typography>
      </>
    )
  );
}

export default function FieldEditor(props: FieldEditorProps): JSX.Element {
  const { field } = props;
  const type = Object.keys(field.fieldSchema.attributes)[0];

  switch (type) {
    case FieldType.CHECKBOX:
      return <CheckBoxEditor {...props} />;
    case FieldType.TEXT:
      return <TextEditor {...props} />;
    case FieldType.NUMERIC:
      return <NumericEditor {...props} />;
    case FieldType.COMBOBOX:
      return <ComboBoxEditor {...props} />;
    case FieldType.SELECT:
      return <SelectEditor {...props} />;
    case FieldType.MULSELECT:
      return <MultiSelectEditor {...props} />;
    default:
      return <DefaultEditor {...props} />;
  }
}

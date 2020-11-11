import Typography from "@material-ui/core/Typography";
import React from "react";
import { getFieldValues } from "../../utils/editors/functions";
import { FieldEditorProps, FieldType } from "../../utils/editors/types";
import CheckBoxEditor from "./checkBoxEditor";
import ComboBoxEditor from "./comboBoxEditor";
import MultiSelectEditor from "./multiSelectEditor";
import NumericEditor from "./numericEditor";
import SelectEditor from "./selectEditor";
import TextEditor from "./textEditor";

function DefaultEditor(props: FieldEditorProps): JSX.Element {
  const { name } = props;

  const frameValues = getFieldValues(props);
  const frameValue = Object.values(frameValues ?? {})[0];
  if (!frameValue) return <></>;
  const value = frameValue[0].value;
  return (
    frameValue && (
      <>
        <Typography variant="overline">{name}</Typography>
        <Typography>{JSON.stringify(value, null, 2)}</Typography>
      </>
    )
  );
}

export default function FieldEditor(props: FieldEditorProps): JSX.Element {
  const { attributes } = props;
  const type = Object.keys(attributes)[0];

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

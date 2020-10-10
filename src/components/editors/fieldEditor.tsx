import React from "react";

import { FieldEditorProps, FieldType } from "../../utils/editors/types";
import CheckBoxEditor from "./checkBoxEditor";
import ComboBoxEditor from "./comboBoxEditor";
import MultiSelectEditor from "./multiSelectEditor";
import NumericEditor from "./numericEditor";
import SelectEditor from "./selectEditor";
import ShapeEditor from "./shapeEditor";
import TextEditor from "./textEditor";

function PrivateFieldEditor(props: FieldEditorProps): JSX.Element {
  const { attributes } = props;
  const type = Object.keys(attributes)[0];

  switch (type) {
    case FieldType.LINE:
    case FieldType.POINT:
    case FieldType.POLYGON:
    case FieldType.RECTANGLE:
      return <ShapeEditor {...props} />;
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
      return <></>;
  }
}

const FieldEditor = PrivateFieldEditor;

export default FieldEditor;

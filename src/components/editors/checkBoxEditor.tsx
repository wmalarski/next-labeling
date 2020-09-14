import React from "react";
import { FieldEditorProps } from "../../utils/editors/types";
import { FieldType } from "../../utils/schema/fields";

export default function CheckBoxEditor(
  props: FieldEditorProps<FieldType.CHECKBOX>,
): JSX.Element {
  const { disabled, frame, values, attributes, onChange } = props;
  return <></>;
}

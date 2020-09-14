import React from "react";
import { FieldEditorProps } from "../../utils/editors/types";
import { FieldType } from "../../utils/schema/fields";

export default function NumericEditor(
  props: FieldEditorProps<FieldType.NUMERIC>,
): JSX.Element {
  const { disabled, frame, values, attributes, onChange } = props;
  return <></>;
}

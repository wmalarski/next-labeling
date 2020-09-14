import React from "react";
import { FieldEditorProps } from "../../utils/editors/types";
import { FieldType } from "../../utils/schema/fields";

export default function MultiSelectEditor(
  props: FieldEditorProps<FieldType.MULSELECT>,
): JSX.Element {
  const { disabled, frame, values, attributes, onChange } = props;
  return <></>;
}

import { shallow } from "enzyme";
import React from "react";
import CheckBoxEditor from "../../src/editors/components/checkBoxEditor";
import { FieldEditorProps, FieldType } from "../../src/editors/types";

function shallowCheckBoxEditor(props: Partial<FieldEditorProps> = {}) {
  const defaultProps: FieldEditorProps = {
    field: {
      fieldSchema: {
        attributes: {},
        id: "a",
        name: "s",
        perFrame: true,
      },
      fieldSchemaId: "a",
      id: "b",
      values: { [FieldType.CHECKBOX]: [{ frame: 1, value: false }] },
    },
    disabled: false,
    frame: 1,
    onChange: () => void 0,
  };
  const newProps = { ...defaultProps, ...props };
  return shallow(<CheckBoxEditor {...newProps} />);
}

describe("<ActionListItem />", () => {
  test("should display a action list item with display name, message and date", async () => {
    const checkBoxEditor = shallowCheckBoxEditor();
    const checkBox = checkBoxEditor.find("checkbox");
    console.log(checkBox.exists());
  });
});

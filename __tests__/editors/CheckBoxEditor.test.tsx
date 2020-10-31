import { shallow } from "enzyme";
import React from "react";
import CheckBoxEditor from "../../components/editors/checkBoxEditor";
import { FieldEditorProps, FieldType } from "../../utils/editors/types";

function shallowCheckBoxEditor(props: Partial<FieldEditorProps> = {}) {
  const defaultProps: FieldEditorProps = {
    attributes: {},
    disabled: false,
    frame: 1,
    name: "editor",
    onChange: () => void 0,
    perFrame: true,
    values: { [FieldType.CHECKBOX]: [{ frame: 1, value: false }] },
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

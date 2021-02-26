import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import React from "react";
import { useSelector } from "react-redux";
import { labelingDirectionSelector } from "../../workspace/redux/selectors";
import { calculateNewValues, getFieldValues } from "../functions";
import { FieldEditorProps, FieldType } from "../types";

export default function CheckBoxEditor(props: FieldEditorProps): JSX.Element {
  const { disabled, name, perFrame, frame, onChange } = props;
  const labelingDirection = useSelector(labelingDirectionSelector);

  const frameValues = getFieldValues(props)?.CheckBox;
  if (!frameValues) return <></>;
  const frameValue = frameValues[0];

  return frameValue ? (
    <FormControlLabel
      control={
        <Checkbox
          disabled={disabled}
          checked={frameValue.value}
          onChange={event => {
            const checked = event.target.checked;
            onChange(values =>
              calculateNewValues(
                values,
                perFrame,
                {
                  [FieldType.CHECKBOX]: [
                    {
                      frame,
                      value: checked,
                    },
                  ],
                },
                labelingDirection,
              ),
            );
          }}
        />
      }
      label={name}
    />
  ) : (
    <></>
  );
}

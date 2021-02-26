import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import { GridSize } from "@material-ui/core/Grid/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import ToggleButton from "@material-ui/lab/ToggleButton";
import React from "react";
import { useSelector } from "react-redux";
import { labelingDirectionSelector } from "../../workspace/redux/selectors";
import { calculateNewValues, getFieldValues } from "../functions";
import { FieldEditorProps, FieldType } from "../types";

export default function SelectEditor(props: FieldEditorProps): JSX.Element {
  const { disabled, frame, perFrame, attributes, name, onChange } = props;
  const labelingDirection = useSelector(labelingDirectionSelector);
  const config = attributes.Select;

  const frameValues = getFieldValues(props)?.Select;
  if (!frameValues) return <></>;
  const frameValue = frameValues[0];
  const selected = frameValue?.value;

  return frameValue && config ? (
    <FormControl>
      <InputLabel id="select-field-type-label">{name}</InputLabel>
      <Grid container spacing={1}>
        {config.options.map(option => (
          <Grid
            item
            key={option.text}
            xs={Math.min(Math.max(1, option.size), 12) as GridSize}
          >
            <ToggleButton
              disabled={disabled}
              value={option.text}
              selected={selected === option.text}
              size="small"
              color="inherit"
              onChange={() =>
                onChange(values =>
                  calculateNewValues(
                    values,
                    perFrame,
                    {
                      [FieldType.SELECT]: [
                        {
                          frame,
                          value: option.text,
                        },
                      ],
                    },
                    labelingDirection,
                  ),
                )
              }
            >
              {option.text}
            </ToggleButton>
          </Grid>
        ))}
      </Grid>
    </FormControl>
  ) : (
    <></>
  );
}

import React, { useState } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import { FieldType, LabelingFieldAttributes } from "../../utils/schema/fields";
import TextField from "@material-ui/core/TextField";
import { Chip } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
    },
  })
);

export interface ComboBoxFormProps {
  attributes: LabelingFieldAttributes[FieldType.COMBOBOX];
  onChange: (attributes: LabelingFieldAttributes[FieldType.COMBOBOX]) => void;
}

export default function ComboBoxForm(props: ComboBoxFormProps): JSX.Element {
  const { attributes, onChange } = props;
  const { options, default: defaultValue } = attributes;
  const classes = useStyles();

  const [text, setText] = useState("");

  return (
    <div className={classes.root}>
      <div>
        {options.map((option, index) => (
          <Chip
            key={option}
            label={option}
            variant="outlined"
            disabled={options.length === 1}
            color={defaultValue === option ? "primary" : "default"}
            onDelete={() => {
              const newOptions = [...options];
              newOptions.splice(index, 1);
              onChange({
                options: newOptions,
                default: defaultValue === option ? newOptions[0] : defaultValue,
              });
            }}
            onClick={() => {
              onChange({ ...attributes, default: option });
            }}
          />
        ))}
      </div>
      <div>
        <TextField
          label="Option"
          variant="outlined"
          fullWidth
          margin="dense"
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
        <Button
          startIcon={<AddIcon />}
          color="inherit"
          disabled={options.includes(text) || text.length === 0}
          onClick={() =>
            onChange({
              ...attributes,
              options: [...options, text],
            })
          }
        >
          Add
        </Button>
      </div>
    </div>
  );
}

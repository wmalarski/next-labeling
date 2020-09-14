import React, { useState } from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import {
  ComboBoxAttributes,
  FieldType,
  OnAttributeChangeHandler,
} from "../../utils/schema/fields";
import TextField from "@material-ui/core/TextField";
import { Chip } from "@material-ui/core";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
    },
  }),
);

export interface ComboBoxFormProps {
  attributes: ComboBoxAttributes;
  onChange: OnAttributeChangeHandler;
}

export default function ComboBoxForm(props: ComboBoxFormProps): JSX.Element {
  const {
    attributes: { options, default: defaultValue },
    onChange,
  } = props;
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
            onDelete={() =>
              onChange(attributes => {
                const comboBox = attributes.ComboBox;
                if (!comboBox) return;
                const newOptions = [...comboBox.options];
                newOptions.splice(index, 1);
                return {
                  [FieldType.COMBOBOX]: {
                    options: newOptions,
                    default:
                      comboBox.default === option
                        ? newOptions[0]
                        : comboBox.default,
                  },
                };
              })
            }
            onClick={() =>
              onChange(attributes => {
                const comboBox = attributes.ComboBox;
                if (!comboBox) return;
                return {
                  [FieldType.COMBOBOX]: { ...comboBox, default: option },
                };
              })
            }
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
          onChange={event => setText(event.target.value)}
        />
        <Button
          startIcon={<AddIcon />}
          color="inherit"
          disabled={options.includes(text) || text.length === 0}
          onClick={() =>
            onChange(attributes => {
              const comboBox = attributes.ComboBox;
              if (!comboBox) return;
              return {
                [FieldType.COMBOBOX]: {
                  ...comboBox,
                  options: [...comboBox.options, text],
                },
              };
            })
          }
        >
          Add
        </Button>
      </div>
    </div>
  );
}

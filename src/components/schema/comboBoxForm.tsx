import React, { useState } from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import { ComboBoxAttributes } from "../../utils/schema/fields";
import TextField from "@material-ui/core/TextField";
import { Chip } from "@material-ui/core";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
    },
  })
);

export interface ComboBoxFormProps {
  attributes: ComboBoxAttributes;
  onChange: (
    provider: (attributes: ComboBoxAttributes) => ComboBoxAttributes
  ) => void;
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
              onChange((attributes) => {
                const newOptions = [...attributes.options];
                newOptions.splice(index, 1);
                return {
                  options: newOptions,
                  default:
                    attributes.default === option
                      ? newOptions[0]
                      : attributes.default,
                };
              })
            }
            onClick={() =>
              onChange((attributes) => ({ ...attributes, default: option }))
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
          onChange={(event) => setText(event.target.value)}
        />
        <Button
          startIcon={<AddIcon />}
          color="inherit"
          disabled={options.includes(text) || text.length === 0}
          onClick={() =>
            onChange((attributes) => ({
              ...attributes,
              options: [...attributes.options, text],
            }))
          }
        >
          Add
        </Button>
      </div>
    </div>
  );
}

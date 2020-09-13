import React, { useState } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import { FieldType, LabelingFieldAttributes } from "../../utils/schema/fields";
import TextField from "@material-ui/core/TextField";
import { Chip } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "100%",
      justifyContent: "space-between",
    },
    column: {
      flexBasis: "33.33%",
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
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
    <>
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
      <TextField
        label="Option"
        variant="outlined"
        value={text}
        onChange={(event) => setText(event.target.value)}
      />
      <Button
        startIcon={<AddIcon />}
        color="inherit"
        disabled={options.includes(text)}
        onClick={() =>
          onChange({
            ...attributes,
            options: [...options, text],
          })
        }
      >
        Add option
      </Button>
    </>
  );
}

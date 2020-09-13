import React, { useState } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { FieldType, LabelingFieldAttributes } from "../../utils/schema/fields";
import TextField from "@material-ui/core/TextField";
import Grid, { GridSize } from "@material-ui/core/Grid/Grid";
import Paper from "@material-ui/core/Paper/Paper";
import IconButton from "@material-ui/core/IconButton/IconButton";
import Checkbox from "@material-ui/core/Checkbox/Checkbox";

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

export interface MulSelectFormProps {
  attributes: LabelingFieldAttributes[FieldType.MULSELECT];
  onChange: (attributes: LabelingFieldAttributes[FieldType.MULSELECT]) => void;
}

export default function MulSelectForm(props: MulSelectFormProps): JSX.Element {
  const { attributes, onChange } = props;
  const { options, default: defaultValues } = attributes;
  const optionTexts = options.map((option) => option.text);
  const classes = useStyles();

  const [inputText, setInputText] = useState("");
  const [inputSize, setInputSize] = useState(4);

  return (
    <>
      <Grid container spacing={1}>
        {options.map(({ text, size }, index) => (
          <Grid
            item
            key={text}
            xs={Math.min(Math.max(1, size), 12) as GridSize}
          >
            <Paper className={classes.paper}>
              {text}
              <Checkbox
                checked={defaultValues.includes(text)}
                onChange={() => {
                  const textIndex = defaultValues.indexOf(text);
                  if (textIndex === -1) {
                    onChange({
                      ...attributes,
                      default: [...defaultValues, text],
                    });
                  } else {
                    const newDefaults = [...defaultValues];
                    newDefaults.splice(textIndex, 1);
                    onChange({ ...attributes, default: newDefaults });
                  }
                }}
              />
              <IconButton
                aria-label="move-up"
                onClick={() => {
                  const newOptions = [...options];
                  const newIndex = index - 1;
                  if (newIndex < 0) return;
                  [newOptions[index], newOptions[newIndex]] = [
                    newOptions[newIndex],
                    newOptions[index],
                  ];
                  onChange({ ...attributes, options: newOptions });
                }}
              >
                <ArrowBackIcon />
              </IconButton>
              <IconButton
                aria-label="move-down"
                onClick={() => {
                  const newOptions = [...options];
                  const newIndex = index + 1;
                  if (newIndex >= newOptions.length) return;
                  [newOptions[index], newOptions[newIndex]] = [
                    newOptions[newIndex],
                    newOptions[index],
                  ];
                  onChange({ ...attributes, options: newOptions });
                }}
              >
                <ArrowForwardIcon />
              </IconButton>
              <IconButton
                aria-label="delete"
                disabled={options.length === 1}
                onClick={() => {
                  const newOptions = [...options];
                  newOptions.splice(index, 1);
                  const textIndex = defaultValues.indexOf(text);
                  if (textIndex === -1) {
                    onChange({ ...attributes, options: newOptions });
                  } else {
                    const newDefaults = [...defaultValues];
                    newDefaults.splice(textIndex, 1);
                    onChange({ options: newOptions, default: newDefaults });
                  }
                }}
              >
                <HighlightOffIcon />
              </IconButton>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <TextField
        label="Option"
        variant="outlined"
        value={inputText}
        onChange={(event) => setInputText(event.target.value)}
      />
      <TextField
        label="Size"
        type="number"
        value={inputSize}
        onChange={(event) => setInputSize(Number(event.target.value))}
        inputProps={{
          min: 1,
          max: 12,
          default: 4,
        }}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <Button
        startIcon={<AddIcon />}
        color="inherit"
        disabled={optionTexts.includes(inputText)}
        onClick={() =>
          onChange({
            ...attributes,
            options: [...options, { text: inputText, size: inputSize }],
          })
        }
      >
        Add option
      </Button>
    </>
  );
}

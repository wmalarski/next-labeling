import React, { useState } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import {
  FieldType,
  OnAttributeChangeHandler,
  SelectAttributes,
} from "../../utils/schema/fields";
import TextField from "@material-ui/core/TextField";
import Grid, { GridSize } from "@material-ui/core/Grid/Grid";
import Paper from "@material-ui/core/Paper/Paper";
import IconButton from "@material-ui/core/IconButton/IconButton";
import Checkbox from "@material-ui/core/Checkbox/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      display: "flex",
      width: "100%",
      flexWrap: "wrap",
      padding: theme.spacing(1),
    },
  }),
);

export interface SelectFormProps {
  attributes: SelectAttributes;
  onChange: OnAttributeChangeHandler;
}

export default function SelectForm(props: SelectFormProps): JSX.Element {
  const {
    attributes: { options, default: defaultValue },
    onChange,
  } = props;
  const optionTexts = options.map(option => option.text);
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
              <FormControlLabel
                control={
                  <Checkbox
                    checked={text === defaultValue}
                    onChange={() =>
                      onChange(attributes => {
                        const select = attributes.Select;
                        if (!select) return;
                        return {
                          [FieldType.SELECT]: {
                            ...select,
                            default: text,
                          },
                        };
                      })
                    }
                  />
                }
                label={text}
              />

              <IconButton
                aria-label="move-up"
                onClick={() =>
                  onChange(attributes => {
                    const select = attributes.Select;
                    if (!select) return;
                    const newOptions = [...select.options];
                    const newIndex = index - 1;
                    if (newIndex < 0) return;
                    [newOptions[index], newOptions[newIndex]] = [
                      newOptions[newIndex],
                      newOptions[index],
                    ];
                    return {
                      [FieldType.SELECT]: { ...select, options: newOptions },
                    };
                  })
                }
              >
                <ArrowBackIcon />
              </IconButton>
              <IconButton
                aria-label="move-down"
                onClick={() =>
                  onChange(attributes => {
                    const select = attributes.Select;
                    if (!select) return;
                    const newOptions = [...select.options];
                    const newIndex = index + 1;
                    if (newIndex >= newOptions.length) return;
                    [newOptions[index], newOptions[newIndex]] = [
                      newOptions[newIndex],
                      newOptions[index],
                    ];
                    return {
                      [FieldType.SELECT]: { ...select, options: newOptions },
                    };
                  })
                }
              >
                <ArrowForwardIcon />
              </IconButton>
              <IconButton
                aria-label="delete"
                disabled={options.length === 1}
                onClick={() =>
                  onChange(attributes => {
                    const select = attributes.Select;
                    if (!select) return;
                    const newOptions = [...select.options];
                    newOptions.splice(index, 1);
                    return {
                      [FieldType.SELECT]: {
                        options: newOptions,
                        default:
                          select.default === text
                            ? newOptions[0].text
                            : select.default,
                      },
                    };
                  })
                }
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
        margin="dense"
        value={inputText}
        onChange={event => setInputText(event.target.value)}
      />
      <TextField
        label="Size"
        type="number"
        variant="outlined"
        margin="dense"
        value={inputSize}
        onChange={event => setInputSize(Number(event.target.value))}
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
        disabled={optionTexts.includes(inputText) || inputText.length === 0}
        onClick={() =>
          onChange(attributes => {
            const select = attributes.Select;
            if (!select) return;
            return {
              [FieldType.SELECT]: {
                ...select,
                options: [
                  ...select.options,
                  { text: inputText, size: inputSize },
                ],
              },
            };
          })
        }
      >
        Add
      </Button>
    </>
  );
}

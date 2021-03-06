import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import Divider from "@material-ui/core/Divider";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import RemoveIcon from "@material-ui/icons/Remove";
import React, { memo } from "react";
import { FieldType } from "../../../editors/types";
import { labelingFieldAttributesDefaults } from "../../defaults";
import { useFieldFormStyles } from "../../styles";
import { FieldSchema } from "../../types";
import AttributesForm from "./attributesForm";

export interface FieldFormProps {
  fieldSchema: FieldSchema;
  onChange: (
    provider: (
      fieldSchema: FieldSchema,
    ) => { fieldSchema: FieldSchema; message: string } | undefined,
    fieldId: string,
  ) => void;
  onRemove: () => void;
  onCopy: () => void;
  onMove: (diff: number) => void;
}

function FieldFormPrivate(props: FieldFormProps): JSX.Element {
  const { fieldSchema, onChange, onRemove, onCopy, onMove } = props;
  const { name, perFrame, attributes, id: fieldId } = fieldSchema;
  const type = Object.keys(attributes)[0];

  const classes = useFieldFormStyles();

  return (
    <>
      <Divider />
      <Grid container spacing={1} className={classes.root}>
        <Grid item xs={4} className={classes.column}>
          <TextField
            variant="outlined"
            fullWidth
            label="Name"
            value={name}
            margin="dense"
            onChange={event => {
              const value = event.target.value;
              onChange(
                field => ({
                  fieldSchema: { ...field, name: value },
                  message: "Field name changed",
                }),
                fieldId,
              );
            }}
          />
          <FormControl>
            <InputLabel id="select-field-type-label">Field Type</InputLabel>
            <Select
              labelId="select-field-type-label"
              id="select-field-type"
              value={type}
              fullWidth
              onChange={event => {
                const newType = event.target.value as FieldType;
                onChange(field => {
                  if (newType === type) return;
                  return {
                    fieldSchema: {
                      ...field,
                      attributes: {
                        [newType]: labelingFieldAttributesDefaults[newType],
                      },
                    },
                    message: "Field type changed",
                  };
                }, fieldId);
              }}
            >
              {Object.entries(FieldType).map(
                ([, name]): JSX.Element => (
                  <MenuItem value={name} key={name}>
                    {name}
                  </MenuItem>
                ),
              )}
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Checkbox
                checked={perFrame}
                onChange={() =>
                  onChange(
                    field => ({
                      fieldSchema: { ...field, perFrame: !field.perFrame },
                      message: "Per frame value changed",
                    }),
                    fieldId,
                  )
                }
                value={perFrame}
              />
            }
            label="Label value per frame"
          />
        </Grid>
        <Grid item xs={7}>
          <AttributesForm
            attributes={attributes}
            onChange={provider =>
              onChange(field => {
                const result = provider(attributes);
                if (!result) return;
                return {
                  fieldSchema: {
                    ...field,
                    attributes: result,
                  },
                  message: "Attribute configuration changed",
                };
              }, fieldId)
            }
          />
        </Grid>
        <Grid item xs={1} md={1}>
          <div className={classes.column}>
            <Button
              size="small"
              color="primary"
              startIcon={<ArrowUpwardIcon />}
              onClick={() => onMove(1)}
            >
              Up
            </Button>
            <Button
              size="small"
              color="primary"
              startIcon={<ArrowDownwardIcon />}
              onClick={() => onMove(-1)}
            >
              Down
            </Button>
            <Button
              size="small"
              color="primary"
              startIcon={<FileCopyIcon />}
              onClick={onCopy}
            >
              Copy
            </Button>
            <Button
              size="small"
              color="primary"
              startIcon={<RemoveIcon />}
              onClick={onRemove}
            >
              Remove
            </Button>
          </div>
        </Grid>
      </Grid>
    </>
  );
}

const FieldForm = memo(
  FieldFormPrivate,
  ({ fieldSchema: prevFieldSchema }, { fieldSchema: nextFieldSchema }) =>
    JSON.stringify(prevFieldSchema) === JSON.stringify(nextFieldSchema),
);

export default FieldForm;

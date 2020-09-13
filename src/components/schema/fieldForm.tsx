import React, { memo } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { LabelingFieldSchema } from "../../utils/schema/types";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import RemoveIcon from "@material-ui/icons/Remove";
import { FieldType } from "../../utils/schema/fields";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import AttributesForm from "./attributesForm";
import Grid from "@material-ui/core/Grid";
import { labelingFieldAttributesDefaults } from "../../utils/schema/defaults";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingTop: theme.spacing(1),
    },
    column: {
      display: "flex",
      flexDirection: "column",
    },
  })
);

export interface FieldFormProps {
  fieldSchema: LabelingFieldSchema;
  onChange: (fieldSchema: LabelingFieldSchema, message: string) => void;
  onRemove: () => void;
  onCopy: () => void;
  onMove: (diff: number) => void;
}

function FieldFormPrivate(props: FieldFormProps): JSX.Element {
  const { fieldSchema, onChange, onRemove, onCopy, onMove } = props;
  const { name, perFrame, type, attributes } = fieldSchema;
  const classes = useStyles();

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
            onChange={(event) =>
              onChange(
                { ...fieldSchema, name: event.target.value },
                "Field name changed"
              )
            }
          />
          <FormControl>
            <InputLabel id="select-field-type-label">Field Type</InputLabel>
            <Select
              labelId="select-field-type-label"
              id="select-field-type"
              value={type}
              fullWidth
              onChange={(event) => {
                const newType = event.target.value as FieldType;
                if (newType === type) return;
                onChange(
                  {
                    ...fieldSchema,
                    type: newType,
                    attributes: labelingFieldAttributesDefaults[newType],
                  },
                  "Field type changed"
                );
              }}
            >
              {Object.entries(FieldType).map(
                ([, name]): JSX.Element => (
                  <MenuItem value={name} key={name}>
                    {name}
                  </MenuItem>
                )
              )}
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Checkbox
                checked={perFrame}
                onChange={() =>
                  onChange(
                    { ...fieldSchema, perFrame: !perFrame },
                    "Per frame value changed"
                  )
                }
                value={perFrame}
              />
            }
            label="Label value per frame"
          />
        </Grid>
        <Grid item xs={7}>
          {/* <Divider orientation="vertical" /> */}

          <AttributesForm
            type={type}
            attributes={attributes}
            onChange={(newAttributes) =>
              onChange(
                {
                  ...fieldSchema,
                  attributes: newAttributes,
                },
                "Attribute configuration changed"
              )
            }
          />
        </Grid>
        <Grid item xs={1} md={1}>
          {/* <Divider orientation="vertical" /> */}
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
    JSON.stringify(prevFieldSchema) === JSON.stringify(nextFieldSchema)
);

export default FieldForm;

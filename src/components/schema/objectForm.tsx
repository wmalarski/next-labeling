import React, { useState } from "react";
import uniqueId from "lodash/uniqueId";
import Typography from "@material-ui/core/Typography";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { LabelingObjectSchema } from "../../utils/schema/types";
import Divider from "@material-ui/core/Divider";
import AccordionActions from "@material-ui/core/AccordionActions";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import ReplayIcon from "@material-ui/icons/Replay";
import SaveIcon from "@material-ui/icons/Save";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import RemoveIcon from "@material-ui/icons/Remove";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import { FieldType } from "../../utils/schema/fields";
import TextField from "@material-ui/core/TextField";
import FieldForm from "./fieldForm";

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

export interface ObjectFormProps {
  objectSchema: LabelingObjectSchema;
  onChange: (objectSchema: LabelingObjectSchema) => void;
  onRemove: () => void;
  onCopy: (objectSchema: LabelingObjectSchema) => void;
  onMove: (diff: number) => void;
}

export default function ObjectForm(props: ObjectFormProps): JSX.Element {
  const { objectSchema, onChange, onRemove, onCopy, onMove } = props;
  const { name, description, fields } = objectSchema;
  const classes = useStyles();

  return (
    <Accordion defaultExpanded>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <div className={classes.column}>
          <Typography className={classes.heading}>{name}</Typography>
        </div>
        <div className={classes.column}>
          <Typography className={classes.secondaryHeading}>
            {description}
          </Typography>
        </div>
      </AccordionSummary>
      <Divider />
      <AccordionDetails>
        <div className={classes.paper}>
          <TextField
            variant="outlined"
            fullWidth
            label="Name"
            value={name}
            margin="dense"
            onChange={(event) =>
              onChange({ ...objectSchema, name: event.target.value })
            }
          />
          <TextField
            variant="outlined"
            fullWidth
            label="Description"
            value={description}
            margin="dense"
            onChange={(event) =>
              onChange({ ...objectSchema, description: event.target.value })
            }
          />
          <Divider />
          {fields.map(
            (field, index): JSX.Element => (
              <FieldForm
                key={index}
                fieldSchema={field}
                onChange={(field) => {
                  const newFields = [...fields];
                  newFields[index] = field;
                  onChange({ ...objectSchema, fields: newFields });
                }}
                onCopy={() =>
                  onChange({
                    ...objectSchema,
                    fields: [
                      ...fields,
                      {
                        ...field,
                        id: uniqueId("field_"),
                      },
                    ],
                  })
                }
                onRemove={() => {
                  const newFields = [...fields];
                  newFields.splice(index, 1);
                  onChange({ ...objectSchema, fields: newFields });
                }}
                onMove={(diff) => {
                  const newFields = [...fields];
                  const newIndex = index - diff;
                  if (newIndex < 0 || newIndex >= newFields.length) return;
                  [newFields[index], newFields[newIndex]] = [
                    newFields[newIndex],
                    newFields[index],
                  ];
                  onChange({ ...objectSchema, fields: newFields });
                }}
              />
            )
          )}
        </div>
      </AccordionDetails>
      <Divider />
      <AccordionActions>
        <Button
          size="small"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() =>
            onChange({
              ...objectSchema,
              fields: [
                ...fields,
                {
                  id: uniqueId("field_"),
                  name: "New field",
                  perFrame: true,
                  type: FieldType.CHECKBOX,
                  attributes: { default: false },
                },
              ],
            })
          }
        >
          New field
        </Button>
        <Button
          size="small"
          color="primary"
          startIcon={<ArrowUpwardIcon />}
          onClick={() => onMove(1)}
        >
          Move up
        </Button>
        <Button
          size="small"
          color="primary"
          startIcon={<ArrowDownwardIcon />}
          onClick={() => onMove(-1)}
        >
          Move down
        </Button>
        <Button
          size="small"
          color="primary"
          startIcon={<FileCopyIcon />}
          onClick={() =>
            onCopy({
              id: uniqueId("field_"),
              name: `${name} - Copy`,
              description,
              fields,
            })
          }
        >
          Copy object
        </Button>
        <Button
          size="small"
          color="primary"
          startIcon={<RemoveIcon />}
          onClick={onRemove}
        >
          Remove object
        </Button>
      </AccordionActions>
    </Accordion>
  );
}

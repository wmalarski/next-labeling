import React, { memo } from "react";
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
import FileCopyIcon from "@material-ui/icons/FileCopy";
import RemoveIcon from "@material-ui/icons/Remove";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import { FieldType } from "../../utils/schema/fields";
import TextField from "@material-ui/core/TextField";
import FieldForm from "./fieldForm";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
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
  onChange: (objectSchema: LabelingObjectSchema, message: string) => void;
  onRemove: () => void;
  onCopy: (objectSchema: LabelingObjectSchema) => void;
  onMove: (diff: number) => void;
}

function ObjectFormPrivate(props: ObjectFormProps): JSX.Element {
  const { objectSchema, onChange, onRemove, onCopy, onMove } = props;
  const { name, description, fields, singleton } = objectSchema;
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
              onChange(
                { ...objectSchema, name: event.target.value },
                "Field name changed"
              )
            }
          />
          <TextField
            variant="outlined"
            fullWidth
            label="Description"
            value={description}
            margin="dense"
            onChange={(event) =>
              onChange(
                { ...objectSchema, description: event.target.value },
                "Field description changed"
              )
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={singleton}
                onChange={() =>
                  onChange(
                    { ...objectSchema, singleton: !singleton },
                    "Field is singleton state changed"
                  )
                }
                value={singleton}
              />
            }
            label="Is singleton?"
          />
          <Divider />
          {fields.map(
            (field, index): JSX.Element => (
              <FieldForm
                key={index}
                fieldSchema={field}
                onChange={(field, message) => {
                  const newFields = [...fields];
                  newFields[index] = field;
                  onChange({ ...objectSchema, fields: newFields }, message);
                }}
                onCopy={() =>
                  onChange(
                    {
                      ...objectSchema,
                      fields: [
                        ...fields,
                        {
                          ...field,
                          id: uniqueId("field_"),
                        },
                      ],
                    },
                    "Field copied"
                  )
                }
                onRemove={() => {
                  const newFields = [...fields];
                  newFields.splice(index, 1);
                  onChange(
                    { ...objectSchema, fields: newFields },
                    "Field removed"
                  );
                }}
                onMove={(diff) => {
                  const newFields = [...fields];
                  const newIndex = index - diff;
                  if (newIndex < 0 || newIndex >= newFields.length) return;
                  [newFields[index], newFields[newIndex]] = [
                    newFields[newIndex],
                    newFields[index],
                  ];
                  onChange(
                    { ...objectSchema, fields: newFields },
                    "Field priority changed"
                  );
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
            onChange(
              {
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
              },
              "New field added"
            )
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
              singleton,
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

const ObjectForm = memo(
  ObjectFormPrivate,
  ({ objectSchema: prevObjectSchema }, { objectSchema: nextObjectSchema }) =>
    JSON.stringify(prevObjectSchema) === JSON.stringify(nextObjectSchema)
);

export default ObjectForm;

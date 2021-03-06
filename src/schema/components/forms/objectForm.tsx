import Accordion from "@material-ui/core/Accordion";
import AccordionActions from "@material-ui/core/AccordionActions";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import Divider from "@material-ui/core/Divider";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import RemoveIcon from "@material-ui/icons/Remove";
import { nanoid } from "@reduxjs/toolkit";
import React, { memo, useCallback } from "react";
import { FieldType } from "../../../editors/types";
import { labelingFieldAttributesDefaults } from "../../defaults";
import { useObjectFormStyles } from "../../styles";
import { ObjectSchema } from "../../types";
import FieldForm from "./fieldForm";

export interface OnChangeProviderResult {
  objectSchema: ObjectSchema;
  message: string;
}

export interface ObjectFormProps {
  objectSchema: ObjectSchema;
  onChange: (
    provider: (
      objectSchema: ObjectSchema,
    ) => OnChangeProviderResult | undefined,
    objectId: string,
  ) => void;
  onRemove: () => void;
  onCopy: (objectSchema: ObjectSchema) => void;
  onMove: (diff: number) => void;
}

function ObjectFormPrivate(props: ObjectFormProps): JSX.Element {
  const { objectSchema, onChange, onRemove, onCopy, onMove } = props;
  const { name, description, fields, singleton, id: objectId } = objectSchema;
  const classes = useObjectFormStyles();

  const onFieldChange = useCallback(
    (provider, fieldId) =>
      onChange(object => {
        const currentIndex = object.fields.findIndex(n => n.id === fieldId);
        if (currentIndex === -1) return;

        const currentField = object.fields[currentIndex];
        const result = provider(currentField);
        if (!result) return;

        const { fieldSchema, message } = result;
        const newFields = [...object.fields];
        newFields[currentIndex] = fieldSchema;
        return {
          objectSchema: { ...object, fields: newFields },
          message,
        };
      }, objectId),
    [onChange, objectId],
  );

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
            onChange={event => {
              const value = event.target.value;
              onChange(
                object => ({
                  objectSchema: { ...object, name: value },
                  message: "Field name changed",
                }),
                objectId,
              );
            }}
          />
          <TextField
            variant="outlined"
            fullWidth
            label="Description"
            value={description}
            margin="dense"
            onChange={event => {
              const value = event.target.value;
              onChange(
                object => ({
                  objectSchema: { ...object, description: value },
                  message: "Field description changed",
                }),
                objectId,
              );
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={singleton}
                onChange={() =>
                  onChange(
                    object => ({
                      objectSchema: { ...object, singleton: !object.singleton },
                      message: "Field is singleton state changed",
                    }),
                    objectId,
                  )
                }
              />
            }
            label="Is singleton?" // TODO: Add svg icon input #8
          />
          <Divider />
          {fields.map(
            (field, index): JSX.Element => (
              <FieldForm
                key={index}
                fieldSchema={field}
                onChange={onFieldChange}
                onCopy={() =>
                  onChange(
                    object => ({
                      objectSchema: {
                        ...object,
                        fields: [
                          ...object.fields,
                          {
                            ...field,
                            id: nanoid(),
                          },
                        ],
                      },
                      message: "Field copied",
                    }),
                    objectId,
                  )
                }
                onRemove={() => {
                  onChange(object => {
                    const newFields = [...object.fields];
                    newFields.splice(index, 1);
                    return {
                      objectSchema: { ...object, fields: newFields },
                      message: "Field removed",
                    };
                  }, objectId);
                }}
                onMove={diff => {
                  onChange(object => {
                    const newFields = [...object.fields];
                    const newIndex = index - diff;
                    if (newIndex < 0 || newIndex >= newFields.length)
                      return undefined;
                    [newFields[index], newFields[newIndex]] = [
                      newFields[newIndex],
                      newFields[index],
                    ];
                    return {
                      objectSchema: { ...object, fields: newFields },
                      message: "Field priority changed",
                    };
                  }, objectId);
                }}
              />
            ),
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
              object => ({
                objectSchema: {
                  ...object,
                  fields: [
                    ...object.fields,
                    {
                      id: nanoid(),
                      name: "New field",
                      perFrame: true,
                      attributes: {
                        [FieldType.CHECKBOX]:
                          labelingFieldAttributesDefaults[FieldType.CHECKBOX],
                      },
                    },
                  ],
                },
                message: "New field added",
              }),
              objectId,
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
              id: nanoid(),
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
    JSON.stringify(prevObjectSchema) === JSON.stringify(nextObjectSchema),
);

export default ObjectForm;

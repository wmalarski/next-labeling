import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import { nanoid } from "@reduxjs/toolkit";
import React, { useCallback } from "react";
import { SchemaState } from "../../hooks/useSchemaHistory";
import { useSchemaFormStyles } from "../../styles";
import { Schema } from "../../types";
import ObjectForm from "./objectForm";
import RawForm from "./rawForm";

export interface SchemaFormProps {
  schema: Schema;
  setSchema: (setter: (schema: Schema) => SchemaState | undefined) => void;
}

export default function SchemaForm(props: SchemaFormProps): JSX.Element {
  const { schema, setSchema } = props;
  const classes = useSchemaFormStyles();

  const onFieldChange = useCallback(
    (provider, id) => {
      setSchema(sch => {
        const currentIndex = sch.objects.findIndex(n => n.id === id);
        if (currentIndex === -1) return;

        const currentObject = sch.objects[currentIndex];
        const result = provider(currentObject);
        if (!result) return;

        const { objectSchema, message } = result;
        const objects = [...sch.objects];
        objects[currentIndex] = objectSchema;
        return { schema: { ...sch, objects }, message };
      });
    },
    [setSchema],
  );

  return (
    <Paper className={classes.root} elevation={3}>
      <Typography component="h1" variant="h5">
        Schema Editor
      </Typography>
      <TextField
        variant="outlined"
        fullWidth
        label="Name"
        value={schema.name}
        margin="dense"
        onChange={event => {
          const name = event.target.value;
          setSchema(sch => ({
            schema: { ...sch, name },
            message: "Schema name changed",
          }));
        }}
      />
      <TextField
        variant="outlined"
        fullWidth
        label="Description"
        value={schema.description}
        margin="dense"
        onChange={event => {
          const description = event.target.value;
          setSchema(sch => ({
            schema: { ...sch, description },
            message: "Schema description changed",
          }));
        }}
      />
      <TextField
        variant="outlined"
        fullWidth
        label="Version"
        value={schema.version}
        margin="dense"
        onChange={event => {
          const version = event.target.value;
          setSchema(sch => ({
            schema: { ...sch, version },
            message: "Schema version changed",
          }));
        }}
      />
      <div>
        <Button
          startIcon={<AddIcon />}
          onClick={() =>
            setSchema(sch => ({
              schema: {
                ...sch,
                objects: [
                  ...sch.objects,
                  {
                    id: nanoid(),
                    name: `Object ${sch.objects.length + 1}`,
                    description: "",
                    fields: [],
                    singleton: false,
                  },
                ],
              },
              message: "New object added",
            }))
          }
        >
          Add object
        </Button>
        <RawForm
          label="Edit Raw Schema"
          startIcon={<EditIcon />}
          schema={schema}
          setSchema={setSchema}
        />
      </div>
      {schema.objects.map(
        (object, index): JSX.Element => (
          <ObjectForm
            key={object.id}
            objectSchema={object}
            onChange={onFieldChange}
            onCopy={object =>
              setSchema(sch => ({
                schema: { ...sch, objects: [...sch.objects, object] },
                message: "Object copied",
              }))
            }
            onRemove={() => {
              setSchema(sch => {
                const objects = [...sch.objects];
                objects.splice(index, 1);
                return {
                  schema: { ...sch, objects },
                  message: "Object removed",
                };
              });
            }}
            onMove={diff => {
              setSchema(sch => {
                const objects = [...sch.objects];
                const newIndex = index - diff;
                if (newIndex < 0 || newIndex >= objects.length) return;
                [objects[index], objects[newIndex]] = [
                  objects[newIndex],
                  objects[index],
                ];
                return {
                  schema: { ...sch, objects },
                  message: "Object priority changed",
                };
              });
            }}
          />
        ),
      )}
    </Paper>
  );
}

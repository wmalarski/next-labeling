import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import uniqueId from "lodash/uniqueId";
import React, { useCallback } from "react";

import { LabelingSchema } from "../../../utils/schema/types";
import { NullableSchemaState } from "../../../utils/schema/useSchemaHistory";
import ObjectForm from "./objectForm";
import RawForm from "./rawForm";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      margin: theme.spacing(2),
      padding: theme.spacing(2),
    },
  }),
);

export interface SchemaFormProps {
  schema: LabelingSchema;
  setSchema: (setter: (schema: LabelingSchema) => NullableSchemaState) => void;
}

export default function SchemaForm(props: SchemaFormProps): JSX.Element {
  const { schema, setSchema } = props;
  const classes = useStyles();

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
                    id: uniqueId("object_"),
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

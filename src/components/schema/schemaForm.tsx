import React, { useCallback } from "react";
import uniqueId from "lodash/uniqueId";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import AddIcon from "@material-ui/icons/Add";
import { LabelingSchema } from "../../utils/schema/types";
import ObjectForm from "./objectForm";
import Button from "@material-ui/core/Button";
import { NullableSchemaState } from "../../utils/schema/useSchemaHistory";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      margin: 10,
    },
  })
);

export interface SchemaFormProps {
  schema: LabelingSchema;
  setSchema: (setter: (schema: LabelingSchema) => NullableSchemaState) => void;
}

export default function SchemaForm(props: SchemaFormProps): JSX.Element {
  const { schema, setSchema } = props;
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Typography component="h1" variant="h5">
        Schema Editor
      </Typography>
      <TextField
        variant="outlined"
        fullWidth
        label="Name"
        value={schema.name}
        margin="dense"
        onChange={(event) =>
          setSchema((sch) => ({
            schema: { ...sch, name: event.target.value },
            message: "Schema name changed",
          }))
        }
      />
      <TextField
        variant="outlined"
        fullWidth
        label="Description"
        value={schema.description}
        margin="dense"
        onChange={(event) =>
          setSchema((sch) => ({
            schema: { ...sch, description: event.target.value },
            message: "Schema description changed",
          }))
        }
      />
      <TextField
        variant="outlined"
        fullWidth
        label="Version"
        value={schema.version}
        margin="dense"
        onChange={(event) =>
          setSchema((sch) => ({
            schema: { ...sch, version: event.target.value },
            message: "Schema version changed",
          }))
        }
      />
      <Button
        startIcon={<AddIcon />}
        onClick={() =>
          setSchema((sch) => ({
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
      {schema.objects.map(
        (object, index): JSX.Element => (
          <ObjectForm
            key={object.id}
            objectSchema={object}
            onChange={(object, message) =>
              setSchema((sch) => {
                const objects = [...sch.objects];
                objects[index] = object;
                return { schema: { ...sch, objects }, message };
              })
            }
            onCopy={(object) =>
              setSchema((sch) => ({
                schema: { ...sch, objects: [...sch.objects, object] },
                message: "Object copied",
              }))
            }
            onRemove={() => {
              setSchema((sch) => {
                const objects = [...sch.objects];
                objects.splice(index, 1);
                return {
                  schema: { ...sch, objects },
                  message: "Object removed",
                };
              });
            }}
            onMove={(diff) => {
              setSchema((sch) => {
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
        )
      )}
    </div>
  );
}

import React from "react";
import uniqueId from "lodash/uniqueId";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import AddIcon from "@material-ui/icons/Add";
import { LabelingSchema } from "../../utils/schema/types";
import ObjectForm from "./objectForm";
import Button from "@material-ui/core/Button";

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
  push: (schema: LabelingSchema, message: string) => void;
}

export default function SchemaForm(props: SchemaFormProps): JSX.Element {
  const { schema, push } = props;
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
          push({ ...schema, name: event.target.value }, "Schema name changed")
        }
      />
      <TextField
        variant="outlined"
        fullWidth
        label="Description"
        value={schema.description}
        margin="dense"
        onChange={(event) =>
          push(
            { ...schema, description: event.target.value },
            "Schema description changed"
          )
        }
      />
      <TextField
        variant="outlined"
        fullWidth
        label="Version"
        value={schema.version}
        margin="dense"
        onChange={(event) =>
          push(
            { ...schema, version: event.target.value },
            "Schema description changed"
          )
        }
      />
      <Button
        startIcon={<AddIcon />}
        onClick={() =>
          push(
            {
              ...schema,
              objects: [
                ...schema.objects,
                {
                  id: uniqueId("object_"),
                  name: `Object ${schema.objects.length + 1}`,
                  description: "",
                  fields: [],
                  singleton: false,
                },
              ],
            },
            "New object added"
          )
        }
      >
        Add object
      </Button>
      {schema.objects.map(
        (object, index): JSX.Element => (
          <ObjectForm
            key={object.id}
            objectSchema={object}
            onChange={(object, message) => {
              const objects = [...schema.objects];
              objects[index] = object;
              push({ ...schema, objects }, message);
            }}
            onCopy={(object) =>
              push(
                { ...schema, objects: [...schema.objects, object] },
                "Object copied"
              )
            }
            onRemove={() => {
              const objects = [...schema.objects];
              objects.splice(index, 1);
              push({ ...schema, objects }, "Object removed");
            }}
            onMove={(diff) => {
              const objects = [...schema.objects];
              const newIndex = index - diff;
              if (newIndex < 0 || newIndex >= objects.length) return;
              [objects[index], objects[newIndex]] = [
                objects[newIndex],
                objects[index],
              ];
              push({ ...schema, objects }, "Object priority changed");
            }}
          />
        )
      )}
    </div>
  );
}

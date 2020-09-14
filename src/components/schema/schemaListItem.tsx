import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import Router from "next/router";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import {
  LabelingFieldSchema,
  LabelingObjectSchema,
  LabelingSchema,
} from "../../utils/schema/types";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Button from "@material-ui/core/Button";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import RemoveIcon from "@material-ui/icons/Remove";
import SaveAltIcon from "@material-ui/icons/SaveAlt";
import EditIcon from "@material-ui/icons/Edit";
import ViewListIcon from "@material-ui/icons/ViewList";

export interface SelectedState {
  object?: LabelingObjectSchema;
  fields: { [objectId: string]: LabelingFieldSchema };
}

export interface SchemaListItemProps {
  schema: LabelingSchema;
}

export default function SchemaListItem(
  props: SchemaListItemProps
): JSX.Element {
  const { schema } = props;

  const [selected, setSelected] = useState<SelectedState>({
    object: schema.objects[0],
    fields: Object.fromEntries(
      schema.objects.map((object) => [object.id, object.fields[0]])
    ),
  });
  const selectedField = selected.object
    ? selected.fields[selected.object?.id]
    : undefined;

  return (
    <Paper>
      <Typography variant="h5">{schema.name}</Typography>
      <Typography variant="caption">{schema.version}</Typography>
      <Typography variant="subtitle1">{schema.description}</Typography>
      <Typography variant="subtitle2">{`Version: ${schema.user?.displayName}`}</Typography>

      <div>
        <Button
          size="small"
          color="primary"
          startIcon={<ViewListIcon />}
          onClick={() => {}}
        >
          Details
        </Button>
        <Button
          size="small"
          color="primary"
          startIcon={<EditIcon />}
          onClick={() => {}}
        >
          Edit
        </Button>
        <Button
          size="small"
          color="primary"
          startIcon={<SaveAltIcon />}
          onClick={() => {}}
        >
          Export
        </Button>
        <Button
          size="small"
          color="primary"
          startIcon={<FileCopyIcon />}
          onClick={() => {}}
        >
          Copy
        </Button>
        <Button
          size="small"
          color="primary"
          startIcon={<RemoveIcon />}
          onClick={() => {}}
        >
          Remove
        </Button>
      </div>

      <Grid container spacing={1}>
        <Grid item xs={4}>
          <List>
            {schema.objects.map((object) => (
              <ListItem
                key={object.id}
                selected={selected.object?.id === object.id}
                onClick={() => setSelected({ ...selected, object })}
              >
                <Typography variant="h6">{object.name}</Typography>
                <Typography variant="body2">{object.description}</Typography>
                <Typography variant="subtitle2">{`Singleton: ${object.singleton}`}</Typography>
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid item xs={4}>
          {(selected.object?.fields ?? []).map((field) => (
            <ListItem
              key={field.id}
              selected={selectedField?.id === field.id}
              onClick={() => {
                if (!selected.object?.id) return;
                setSelected({
                  ...selected,
                  fields: { ...selected.fields, [selected.object.id]: field },
                });
              }}
            >
              <Typography variant="subtitle1">{field.name}</Typography>
            </ListItem>
          ))}
        </Grid>
        <Grid item xs={4}>
          {selectedField ? (
            <>
              <Typography variant="h5">{selectedField.name}</Typography>
              <Typography variant="subtitle1">
                {selectedField.perFrame}
              </Typography>
              <Typography variant="subtitle2">{selectedField.type}</Typography>
              <pre className="text-xs">
                {JSON.stringify(selectedField.attributes || {}, null, 2)}
              </pre>
            </>
          ) : (
            <></>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
}

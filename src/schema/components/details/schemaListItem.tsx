import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import EditIcon from "@material-ui/icons/Edit";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import SaveAltIcon from "@material-ui/icons/SaveAlt";
import ViewListIcon from "@material-ui/icons/ViewList";
import { useRouter } from "next/router";
import React, { useState } from "react";
import useAuth from "../../../auth/hooks/useAuth";
import CreateLabelingDialog from "../../../labeling/components/createLabelingDialog";
import { useSchemaListItemStyles } from "../../styles";
import { FieldSchema, ObjectSchema, SchemaDocument } from "../../types";
import RawForm from "../forms/rawForm";
import FieldDetails from "./fieldDetails";

export interface SelectedState {
  object?: ObjectSchema;
  fields: { [objectId: string]: FieldSchema };
}

export interface SchemaListItemProps {
  schemaId: string;
  document: SchemaDocument;
  onRemoveClicked: () => void;
  onCopyClicked: () => void;
}

export default function SchemaListItem(
  props: SchemaListItemProps,
): JSX.Element {
  const { schemaId, document, onRemoveClicked, onCopyClicked } = props;
  const { schema, user } = document;
  const classes = useSchemaListItemStyles();

  const { authUser } = useAuth();
  const isSameUser = user.id === authUser?.id;

  const router = useRouter();

  const [selected, setSelected] = useState<SelectedState>({
    object: schema.objects[0],
    fields: Object.fromEntries(
      schema.objects.map(object => [object.id, object.fields[0]]),
    ),
  });
  const selectedField = selected.object
    ? selected.fields[selected.object?.id]
    : undefined;

  return (
    <Paper className={classes.paper} elevation={3}>
      <Typography variant="h5">{schema.name}</Typography>
      <Typography variant="subtitle2">{`Version: ${schema.version}`}</Typography>
      <Typography variant="subtitle1">{schema.description}</Typography>
      <Typography variant="subtitle2">{`Author: ${user?.displayName}`}</Typography>
      <Divider />
      <div>
        <Button
          size="small"
          color="inherit"
          startIcon={<ViewListIcon />}
          onClick={() =>
            router.push("/schema/[schemaId]", `/schema/${schemaId}`)
          }
        >
          Details
        </Button>
        <CreateLabelingDialog schemaId={schemaId} schema={document} />
        {isSameUser ? (
          <Button
            size="small"
            color="inherit"
            startIcon={<EditIcon />}
            onClick={() =>
              router.push("/schema/edit/[schemaId]", `/schema/edit/${schemaId}`)
            }
          >
            Edit
          </Button>
        ) : (
          <></>
        )}
        <RawForm startIcon={<SaveAltIcon />} label="Export" schema={schema} />
        <Button
          size="small"
          color="inherit"
          startIcon={<FileCopyIcon />}
          onClick={() => onCopyClicked()}
        >
          Copy
        </Button>
        {isSameUser ? (
          <Button
            size="small"
            color="inherit"
            startIcon={<DeleteOutlineIcon />}
            onClick={() => onRemoveClicked()}
          >
            Remove
          </Button>
        ) : (
          <></>
        )}
      </div>
      <Divider />
      <div className={classes.grid}>
        <Grid container spacing={1}>
          <Grid item xs={4}>
            <List>
              {schema.objects.map(object => (
                <div key={object.id}>
                  <ListItem
                    selected={selected.object?.id === object.id}
                    onClick={() => setSelected({ ...selected, object })}
                  >
                    <div>
                      <Typography variant="h6">{object.name}</Typography>
                      <Typography variant="body2">
                        {object.description}
                      </Typography>
                      <Typography variant="subtitle2">{`Singleton: ${object.singleton}`}</Typography>
                    </div>
                  </ListItem>
                  <Divider />
                </div>
              ))}
            </List>
          </Grid>
          <Grid item xs={4}>
            {(selected.object?.fields ?? []).map(field => (
              <div key={field.id}>
                <ListItem
                  selected={selectedField?.id === field.id}
                  onClick={() => {
                    if (!selected.object?.id) return;
                    setSelected({
                      ...selected,
                      fields: {
                        ...selected.fields,
                        [selected.object.id]: field,
                      },
                    });
                  }}
                >
                  <Typography variant="subtitle1">{field.name}</Typography>
                </ListItem>
                <Divider />
              </div>
            ))}
          </Grid>
          <Grid item xs={4}>
            {selectedField ? <FieldDetails field={selectedField} /> : <></>}
          </Grid>
        </Grid>
      </div>
    </Paper>
  );
}

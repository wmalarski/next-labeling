import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import Chip from "@material-ui/core/Chip";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import React, { useState } from "react";

import {
  ProjectChangeFnc,
  ProjectDocument,
} from "../../../utils/projects/types";

export interface ProjectGeneralFormProps {
  document: ProjectDocument;
  pushProject: ProjectChangeFnc;
}

export default function ProjectGeneralForm(
  props: ProjectGeneralFormProps,
): JSX.Element {
  const { document, pushProject } = props;
  const { name, description, tags, isPublic } = document;

  const [editedTag, setEditedTag] = useState<string>("");

  return (
    <Paper>
      <TextField
        required
        fullWidth
        label="Name"
        value={name}
        onChange={event =>
          pushProject(doc => ({ ...doc, name: event.target.value }))
        }
      />
      <TextField
        required
        fullWidth
        label="Description"
        multiline
        rowsMax={6}
        value={description}
        onChange={event =>
          pushProject(doc => ({ ...doc, description: event.target.value }))
        }
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={isPublic}
            onChange={() =>
              pushProject(doc => ({ ...doc, isPublic: !doc.isPublic }))
            }
          />
        }
        label="Public"
      />
      {tags.map((tag, index) => (
        <Chip
          key={tag}
          label={tag}
          onDelete={() =>
            pushProject(doc => {
              const newTags = [...tags];
              newTags.splice(index, 1);
              return { ...doc, tags: newTags };
            })
          }
        />
      ))}
      <form
        onSubmit={event => {
          event.preventDefault();
          pushProject(doc => ({ ...doc, tags: [...doc.tags, editedTag] }));
          setEditedTag("");
        }}
      >
        <TextField
          required
          fullWidth
          label="Tag"
          value={editedTag}
          onChange={event => setEditedTag(event.target.value)}
        />
        <Button type="submit">Add</Button>
      </form>
    </Paper>
  );
}

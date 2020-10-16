import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import Chip from "@material-ui/core/Chip";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import React, { useState } from "react";

import { UseProjectHistoryFnc } from "../../../utils/projects/hooks/useProjectHistory";
import { ProjectDocument } from "../../../utils/projects/types";

export interface ProjectGeneralFormProps {
  project: ProjectDocument;
  push: UseProjectHistoryFnc;
}

export default function ProjectGeneralForm(
  props: ProjectGeneralFormProps,
): JSX.Element {
  const { project, push } = props;
  const { name, description, tags, isPublic } = project;

  const [editedTag, setEditedTag] = useState<string>("");

  return (
    <Paper>
      <TextField
        required
        fullWidth
        label="Name"
        value={name}
        onChange={event =>
          push(state => ({
            ...state,
            project: { ...state.project, name: event.target.value },
          }))
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
          push(state => ({
            ...state,
            project: { ...state.project, description: event.target.value },
          }))
        }
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={isPublic}
            onChange={() =>
              push(state => ({
                ...state,
                project: {
                  ...state.project,
                  isPublic: !state.project.isPublic,
                },
              }))
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
            push(state => {
              const newTags = [...tags];
              newTags.splice(index, 1);
              return { ...state, project: { ...state.project, tags: newTags } };
            })
          }
        />
      ))}
      <form
        onSubmit={event => {
          event.preventDefault();
          push(state => ({
            ...state,
            project: {
              ...state.project,
              tags: [...state.project.tags, editedTag],
            },
          }));
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

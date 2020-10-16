import IconButton from "@material-ui/core/IconButton";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import AddIcon from "@material-ui/icons/Add";
import ClearIcon from "@material-ui/icons/Clear";
import React, { useState } from "react";

import { normalizeWorkflowRoles } from "../../../utils/projects/functions";
import { UseProjectHistoryFnc } from "../../../utils/projects/hooks/useProjectHistory";
import { ProjectDocument } from "../../../utils/projects/types";

export interface WorkflowRoleTableEditorProps {
  project: ProjectDocument;
  push: UseProjectHistoryFnc;
}

export default function WorkflowRoleTableEditorForm(
  props: WorkflowRoleTableEditorProps,
): JSX.Element {
  const { project, push } = props;
  const { workflow } = project;
  const { roles } = workflow;

  const [newRole, setNewRole] = useState<string>("");

  return (
    <TableHead>
      <TableRow>
        <TableCell />
        {roles.map(role => (
          <TableCell key={role} align="center">
            {role.toUpperCase()}
            <IconButton
              aria-label="delete"
              size="small"
              disabled={roles.length < 2}
              onClick={() =>
                push(state => ({
                  ...state,
                  project: {
                    ...state.project,
                    workflow: normalizeWorkflowRoles({
                      ...state.project.workflow,
                      roles: state.project.workflow.roles.filter(
                        r => r !== role,
                      ),
                    }),
                  },
                }))
              }
            >
              <ClearIcon />
            </IconButton>
          </TableCell>
        ))}
        <TableCell align="right">
          <form
            onSubmit={event => {
              event.preventDefault();
              push(state => ({
                ...state,
                project: {
                  ...state.project,
                  workflow: {
                    ...state.project.workflow,
                    roles: [...state.project.workflow.roles, newRole],
                  },
                },
              }));
              setNewRole("");
            }}
          >
            <TextField
              label="New role"
              value={newRole}
              onChange={event => setNewRole(event.target.value)}
            />
            <IconButton type="submit" size="small" aria-label="delete">
              <AddIcon />
            </IconButton>
          </form>
        </TableCell>
      </TableRow>
    </TableHead>
  );
}

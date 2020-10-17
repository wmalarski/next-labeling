import IconButton from "@material-ui/core/IconButton";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import AddIcon from "@material-ui/icons/Add";
import ClearIcon from "@material-ui/icons/Clear";
import React, { useState } from "react";

import { normalizeWorkflowRoles } from "../../../utils/projects/functions";
import {
  ProjectDocument,
  WorkflowDocument,
} from "../../../utils/projects/types";

export interface WorkflowRoleTableEditorProps {
  project: ProjectDocument;
  push: (provider: (workflow: WorkflowDocument) => WorkflowDocument) => void;
}

export default function WorkflowRoleTableEditorForm(
  props: WorkflowRoleTableEditorProps,
): JSX.Element {
  const { project, push } = props;
  const { workflow } = project;
  const { roles } = workflow;

  const [newRole, setNewRole] = useState<string>("");
  const isNewRoleValid = newRole.length > 0 && !roles.includes(newRole);

  return (
    <TableHead>
      <TableRow>
        <TableCell align="center">Write Access</TableCell>
        {roles.map(role => (
          <TableCell key={role} align="center">
            {role}
            <IconButton
              aria-label="delete"
              size="small"
              disabled={roles.length < 2}
              onClick={() =>
                push(state =>
                  normalizeWorkflowRoles({
                    ...state,
                    roles: state.roles.filter(r => r !== role),
                  }),
                )
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
              push(state => ({ ...state, roles: [...state.roles, newRole] }));
              setNewRole("");
            }}
          >
            <TextField
              label="New role"
              required
              value={newRole}
              onChange={event => setNewRole(event.target.value)}
            />
            <IconButton
              type="submit"
              size="small"
              aria-label="delete"
              disabled={!isNewRoleValid}
            >
              <AddIcon />
            </IconButton>
          </form>
        </TableCell>
      </TableRow>
    </TableHead>
  );
}

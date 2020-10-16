import IconButton from "@material-ui/core/IconButton";
import TableBody from "@material-ui/core/TableBody";
import TableCell, { TableCellProps } from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import range from "lodash/range";
import React, { useState } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import AddIcon from "@material-ui/icons/Add";

import { UseProjectHistoryFnc } from "../../../utils/projects/hooks/useProjectHistory";
import { ProjectDocument, WorkflowEdge } from "../../../utils/projects/types";
import { normalizeWorkflowRoles } from "../../../utils/projects/functions";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

export interface WorkflowEdgeTableEditorProps {
  project: ProjectDocument;
  push: UseProjectHistoryFnc;
}

function renderTableSpace(size: number, props: TableCellProps): JSX.Element[] {
  return range(size).map(index => <TableCell {...props} key={index} />);
}

export default function WorkflowEdgeTableEditorForm(
  props: WorkflowEdgeTableEditorProps,
): JSX.Element {
  const { project, push } = props;
  const { workflow } = project;
  const { roles, nodes } = workflow;

  const [newEdge, setNewEdge] = useState<WorkflowEdge>({
    description: "",
    fromNode: nodes[0].name,
    toNode: nodes[nodes.length - 1].name,
    name: "",
    roles: [],
  });

  const handleRoleChange = (edgeName: string, role: string) => (
    _event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ): void =>
    push(state => ({
      ...state,
      project: {
        ...state.project,
        workflow: {
          ...state.project.workflow,
          edges: state.project.workflow.edges.map(edge =>
            edge.name !== edgeName
              ? edge
              : {
                  ...edge,
                  roles: checked
                    ? [...edge.roles, role]
                    : edge.roles.filter(r => r !== role),
                },
          ),
        },
      },
    }));

  return (
    <>
      <TableHead>
        <TableRow>
          <TableCell size="small" align="center">
            Edges
          </TableCell>
          {renderTableSpace(roles.length + 1, { size: "small" })}
        </TableRow>
      </TableHead>
      <TableBody>
        {workflow.edges.map(edge => (
          <TableRow key={edge.name}>
            <TableCell component="th" scope="row">
              <Typography variant="button">
                {edge.name.toUpperCase()}
              </Typography>
              <IconButton
                aria-label="delete edge"
                size="small"
                onClick={() =>
                  push(state => ({
                    ...state,
                    project: {
                      ...state.project,
                      workflow: normalizeWorkflowRoles({
                        ...state.project.workflow,
                        edges: state.project.workflow.edges.filter(
                          e => e.name !== edge.name,
                        ),
                      }),
                    },
                  }))
                }
              >
                <ClearIcon />
              </IconButton>
              <Typography variant="body2">{`${edge.fromNode.toUpperCase()}->${edge.toNode.toUpperCase()}`}</Typography>
            </TableCell>
            {roles.map(role => (
              <TableCell key={role} align="center" padding="checkbox">
                <Checkbox
                  checked={edge.roles.includes(role)}
                  onChange={handleRoleChange(edge.name, role)}
                  inputProps={{ "aria-label": "primary checkbox" }}
                />
              </TableCell>
            ))}
            <TableCell align="right" />
          </TableRow>
        ))}
        <TableRow>
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
                      edges: [...state.project.workflow.edges, newEdge],
                    },
                  },
                }));
                setNewEdge(prev => ({
                  ...prev,
                  name: "",
                }));
              }}
            >
              <TextField
                label="New node"
                value={newEdge.name}
                onChange={event => {
                  const name = event.target.value;
                  setNewEdge(prev => ({ ...prev, name }));
                }}
              />
              <IconButton type="submit" size="small" aria-label="add">
                <AddIcon />
              </IconButton>
            </form>
          </TableCell>
          {renderTableSpace(roles.length + 1, { size: "small" })}
        </TableRow>
      </TableBody>
    </>
  );
}

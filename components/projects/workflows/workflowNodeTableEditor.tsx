import { Typography } from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import TableBody from "@material-ui/core/TableBody";
import TableCell, { TableCellProps } from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import AddIcon from "@material-ui/icons/Add";
import ClearIcon from "@material-ui/icons/Clear";
import range from "lodash/range";
import React, { useState } from "react";

import { normalizeWorkflowRoles } from "../../../utils/projects/functions";
import { UseProjectHistoryFnc } from "../../../utils/projects/hooks/useProjectHistory";
import { ProjectDocument } from "../../../utils/projects/types";

export interface WorkflowNodeTableEditorProps {
  project: ProjectDocument;
  push: UseProjectHistoryFnc;
}

function renderTableSpace(size: number, props: TableCellProps): JSX.Element[] {
  return range(size).map(index => <TableCell {...props} key={index} />);
}

export default function WorkflowNodeTableEditorForm(
  props: WorkflowNodeTableEditorProps,
): JSX.Element {
  const { project, push } = props;
  const { workflow } = project;
  const { roles, nodes } = workflow;

  const [newNode, setNewNode] = useState<string>("");

  const handleRoleChange = (nodeName: string, role: string) => (
    _event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ): void =>
    push(state => ({
      ...state,
      project: {
        ...state.project,
        workflow: {
          ...state.project.workflow,
          nodes: state.project.workflow.nodes.map(node =>
            node.name !== nodeName
              ? node
              : {
                  ...node,
                  roles: checked
                    ? [...node.roles, role]
                    : node.roles.filter(r => r !== role),
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
            Nodes
          </TableCell>
          {renderTableSpace(roles.length + 1, { size: "small" })}
        </TableRow>
      </TableHead>
      <TableBody>
        {nodes.map(node => (
          <TableRow key={node.name}>
            <TableCell component="th" scope="row">
              <Typography variant="button">
                {node.name.toUpperCase()}
              </Typography>
              <IconButton
                aria-label="delete node"
                disabled={nodes.length < 2}
                size="small"
                onClick={() =>
                  push(state => ({
                    ...state,
                    project: {
                      ...state.project,
                      workflow: normalizeWorkflowRoles({
                        ...state.project.workflow,
                        nodes: state.project.workflow.nodes.filter(
                          n => n.name !== node.name,
                        ),
                      }),
                    },
                  }))
                }
              >
                <ClearIcon />
              </IconButton>
              <Typography variant="body2">{node.description}</Typography>
            </TableCell>
            {roles.map(role => (
              <TableCell key={role} align="center" padding="checkbox">
                <Checkbox
                  checked={node.roles.includes(role)}
                  onChange={handleRoleChange(node.name, role)}
                  inputProps={{ "aria-label": "primary checkbox" }}
                />
              </TableCell>
            ))}
            <TableCell align="right" />
          </TableRow>
        ))}
        <TableRow>
          <TableCell align="left">
            <form
              onSubmit={event => {
                event.preventDefault();
                push(state => ({
                  ...state,
                  project: {
                    ...state.project,
                    workflow: {
                      ...state.project.workflow,
                      nodes: [
                        ...state.project.workflow.nodes,
                        {
                          description: "",
                          name: newNode,
                          roles: [],
                        },
                      ],
                    },
                  },
                }));
                setNewNode("");
              }}
            >
              <TextField
                label="New node"
                value={newNode}
                onChange={event => setNewNode(event.target.value)}
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

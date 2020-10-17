import { Typography } from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import { createStyles, makeStyles } from "@material-ui/core/styles";
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
import { WorkflowDocument, WorkflowNode } from "../../../utils/projects/types";

const useStyles = makeStyles(() =>
  createStyles({
    editor: {
      display: "flex",
      flexDirection: "column",
    },
  }),
);

export interface WorkflowNodeTableEditorProps {
  workflow: WorkflowDocument;
  push: (provider: (workflow: WorkflowDocument) => WorkflowDocument) => void;
}

function renderTableSpace(size: number, props: TableCellProps): JSX.Element[] {
  return range(size).map(index => <TableCell {...props} key={index} />);
}

export default function WorkflowNodeTableEditorForm(
  props: WorkflowNodeTableEditorProps,
): JSX.Element {
  const classes = useStyles();

  const { workflow, push } = props;
  const { roles, nodes } = workflow;

  const [newNode, setNewNode] = useState<WorkflowNode>({
    description: "",
    name: "",
    roles: [],
  });

  const nodeNames = nodes.map(node => node.name.toUpperCase());
  const isNewNodeValid =
    newNode.name.length > 0 && !nodeNames.includes(newNode.name.toUpperCase());

  const handleRoleChange = (nodeName: string, role: string) => (
    _event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ): void =>
    push(state => ({
      ...state,
      nodes: state.nodes.map(node =>
        node.name !== nodeName
          ? node
          : {
              ...node,
              roles: checked
                ? [...node.roles, role]
                : node.roles.filter(r => r !== role),
            },
      ),
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
              <Typography variant="button">{node.name}</Typography>
              <IconButton
                aria-label="delete node"
                disabled={nodes.length < 2}
                size="small"
                onClick={() =>
                  push(state =>
                    normalizeWorkflowRoles({
                      ...state,
                      nodes: state.nodes.filter(n => n.name !== node.name),
                    }),
                  )
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
              className={classes.editor}
              onSubmit={event => {
                event.preventDefault();
                push(state => ({ ...state, nodes: [...state.nodes, newNode] }));
                setNewNode({ description: "", name: "", roles: [] });
              }}
            >
              <TextField
                label="New node"
                required
                value={newNode.name}
                onChange={event => {
                  const name = event.target.value;
                  setNewNode(state => ({ ...state, name }));
                }}
              />
              <TextField
                label="Description"
                value={newNode.description}
                onChange={event => {
                  const description = event.target.value;
                  setNewNode(state => ({ ...state, description }));
                }}
              />
              <IconButton
                type="submit"
                size="small"
                aria-label="add"
                disabled={!isNewNodeValid}
              >
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

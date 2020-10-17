import Checkbox from "@material-ui/core/Checkbox";
import FormControl from "@material-ui/core/FormControl";
import IconButton from "@material-ui/core/IconButton";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import TableBody from "@material-ui/core/TableBody";
import TableCell, { TableCellProps } from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import ClearIcon from "@material-ui/icons/Clear";
import range from "lodash/range";
import React, { useState } from "react";

import { normalizeWorkflowRoles } from "../../../utils/projects/functions";
import { WorkflowDocument, WorkflowEdge } from "../../../utils/projects/types";

const useStyles = makeStyles(() =>
  createStyles({
    editor: {
      display: "flex",
      flexDirection: "column",
    },
  }),
);

export interface WorkflowEdgeTableEditorProps {
  workflow: WorkflowDocument;
  push: (provider: (workflow: WorkflowDocument) => WorkflowDocument) => void;
}

function renderTableSpace(size: number, props: TableCellProps): JSX.Element[] {
  return range(size).map(index => <TableCell {...props} key={index} />);
}

export default function WorkflowEdgeTableEditorForm(
  props: WorkflowEdgeTableEditorProps,
): JSX.Element {
  const classes = useStyles();

  const { workflow, push } = props;
  const { roles, nodes, edges } = workflow;

  const [newEdge, setNewEdge] = useState<WorkflowEdge>({
    description: "",
    fromNode: nodes[0].name,
    toNode: nodes[nodes.length - 1].name,
    name: "",
    roles: [],
  });

  const nodeNames = nodes.map(node => node.name);
  const edgeNames = edges.map(edge => edge.name.toUpperCase());
  const isNewEdgeValid =
    nodeNames.includes(newEdge.fromNode) &&
    nodeNames.includes(newEdge.toNode) &&
    newEdge.name.length > 0 &&
    !edgeNames.includes(newEdge.name.toUpperCase());

  const handleRoleChange = (edgeName: string, role: string) => (
    _event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ): void =>
    push(state => ({
      ...state,
      edges: state.edges.map(edge =>
        edge.name !== edgeName
          ? edge
          : {
              ...edge,
              roles: checked
                ? [...edge.roles, role]
                : edge.roles.filter(r => r !== role),
            },
      ),
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
              <Typography variant="button">{edge.name}</Typography>
              <IconButton
                aria-label="delete edge"
                size="small"
                onClick={() =>
                  push(state =>
                    normalizeWorkflowRoles({
                      ...state,
                      edges: state.edges.filter(e => e.name !== edge.name),
                    }),
                  )
                }
              >
                <ClearIcon />
              </IconButton>
              <Typography variant="body2">{`${edge.fromNode}->${edge.toNode}`}</Typography>
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
              className={classes.editor}
              onSubmit={event => {
                event.preventDefault();
                push(state => ({
                  ...state,
                  edges: [...state.edges, newEdge],
                }));
                setNewEdge(prev => ({
                  ...prev,
                  name: "",
                  description: "",
                }));
              }}
            >
              <TextField
                label="New edge"
                required
                value={newEdge.name}
                onChange={event => {
                  const name = event.target.value;
                  setNewEdge(prev => ({ ...prev, name }));
                }}
              />
              <TextField
                label="Description"
                value={newEdge.description}
                onChange={event => {
                  const description = event.target.value;
                  setNewEdge(prev => ({ ...prev, description }));
                }}
              />
              <FormControl>
                <InputLabel id="from-select-label">From</InputLabel>
                <Select
                  labelId="from-select-label"
                  required
                  value={newEdge.fromNode}
                  onChange={event => {
                    const fromNode = event.target.value as string;
                    setNewEdge(prev => ({ ...prev, fromNode }));
                  }}
                >
                  {nodes.map(node => (
                    <MenuItem key={node.name} value={node.name}>
                      {node.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <InputLabel id="to-select-label">To</InputLabel>
                <Select
                  labelId="to-select-label"
                  required
                  value={newEdge.toNode}
                  onChange={event => {
                    const toNode = event.target.value as string;
                    setNewEdge(prev => ({ ...prev, toNode }));
                  }}
                >
                  {nodes.map(node => (
                    <MenuItem key={node.name} value={node.name}>
                      {node.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <IconButton
                type="submit"
                size="small"
                aria-label="add"
                disabled={!isNewEdgeValid}
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

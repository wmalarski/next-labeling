import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableContainer from "@material-ui/core/TableContainer";
import React from "react";

import { UseProjectHistoryFnc } from "../../../utils/projects/hooks/useProjectHistory";
import { ProjectDocument } from "../../../utils/projects/types";
import WorkflowEdgeTableEditorForm from "../workflows/workflowEdgeTableEditor";
import WorkflowNodeTableEditorForm from "../workflows/workflowNodeTableEditor";
import WorkflowRoleTableEditorForm from "../workflows/workflowRoleTableEditor";

export interface ProjectWorkflowFormProps {
  project: ProjectDocument;
  push: UseProjectHistoryFnc;
}

export default function ProjectWorkflowForm(
  props: ProjectWorkflowFormProps,
): JSX.Element {
  const { project, push } = props;

  return (
    <TableContainer component={Paper}>
      <Table aria-label="role and node access">
        <WorkflowRoleTableEditorForm project={project} push={push} />
        <WorkflowNodeTableEditorForm project={project} push={push} />
        <WorkflowEdgeTableEditorForm project={project} push={push} />
      </Table>
    </TableContainer>
  );
}

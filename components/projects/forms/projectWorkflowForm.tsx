import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableContainer from "@material-ui/core/TableContainer";
import React, { useCallback } from "react";

import { UseProjectHistoryFnc } from "../../../utils/projects/hooks/useProjectHistory";
import {
  ProjectDocument,
  WorkflowDocument,
} from "../../../utils/projects/types";
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

  const workflowPush = useCallback(
    (provider: (workflow: WorkflowDocument) => WorkflowDocument): void =>
      push(state => ({
        ...state,
        project: {
          ...state.project,
          workflow: provider(state.project.workflow),
        },
      })),
    [push],
  );

  return (
    <TableContainer component={Paper}>
      <Table aria-label="role and node access">
        <WorkflowRoleTableEditorForm project={project} push={workflowPush} />
        <WorkflowNodeTableEditorForm project={project} push={workflowPush} />
        <WorkflowEdgeTableEditorForm project={project} push={workflowPush} />
      </Table>
    </TableContainer>
  );
}

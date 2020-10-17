import { Typography } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Tab from "@material-ui/core/Tab";
import Table from "@material-ui/core/Table";
import TableContainer from "@material-ui/core/TableContainer";
import Tabs from "@material-ui/core/Tabs";
import React, { useCallback, useState } from "react";

import { UseProjectHistoryFnc } from "../../../utils/projects/hooks/useProjectHistory";
import {
  ProjectDocument,
  WorkflowDocument,
} from "../../../utils/projects/types";
import TabPanel from "../../common/tabPanel";
import WorkflowEdgeTableEditorForm from "../workflows/workflowEdgeTableEditor";
import WorkflowNodeTableEditorForm from "../workflows/workflowNodeTableEditor";
import WorkflowRoleTableEditorForm from "../workflows/workflowRoleTableEditor";
import WorkflowTextEditor from "../workflows/workflowTextEditor";

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

  const [tabsIndex, setTabsIndex] = useState(1);

  return (
    <Paper>
      <Tabs
        value={tabsIndex}
        onChange={(_event, newValue) => setTabsIndex(newValue)}
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        <Tab label="Import" disabled />
        <Tab label="Table" />
        <Tab label="JSON" />
        <Tab label="Graph" disabled />
      </Tabs>
      <TabPanel value={tabsIndex} index={0}>
        <Typography variant="body2">Import from exisiting project</Typography>
      </TabPanel>
      <TabPanel value={tabsIndex} index={1}>
        <TableContainer component={Paper}>
          <Table aria-label="role and node access">
            <WorkflowRoleTableEditorForm
              workflow={project.workflow}
              push={workflowPush}
            />
            <WorkflowNodeTableEditorForm
              workflow={project.workflow}
              push={workflowPush}
            />
            <WorkflowEdgeTableEditorForm
              workflow={project.workflow}
              push={workflowPush}
            />
          </Table>
        </TableContainer>
      </TabPanel>
      <TabPanel value={tabsIndex} index={2}>
        <WorkflowTextEditor workflow={project.workflow} push={workflowPush} />
      </TabPanel>
      <TabPanel value={tabsIndex} index={3}>
        <Typography variant="body2">TODO</Typography>
      </TabPanel>
    </Paper>
  );
}

import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Tab from "@material-ui/core/Tab";
import Table from "@material-ui/core/Table";
import TableContainer from "@material-ui/core/TableContainer";
import Tabs from "@material-ui/core/Tabs";
import Typography from "@material-ui/core/Typography";
import React, { useCallback } from "react";

import { UseProjectHistoryFnc } from "../../../utils/projects/hooks/useProjectHistory";
import {
  ProjectDocument,
  WorkflowDocument,
} from "../../../utils/projects/types";
import WorkflowEdgeTableEditorForm from "../workflows/workflowEdgeTableEditor";
import WorkflowNodeTableEditorForm from "../workflows/workflowNodeTableEditor";
import WorkflowRoleTableEditorForm from "../workflows/workflowRoleTableEditor";
import WorkflowTextEditor from "../workflows/workflowTextEditor";

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}

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

  const [value, setValue] = React.useState(1);

  const handleChange = (event: React.ChangeEvent<any>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Paper>
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        <Tab label="Import" disabled />
        <Tab label="Table" />
        <Tab label="JSON" />
        <Tab label="Graph" disabled />
      </Tabs>
      <TabPanel value={value} index={0}>
        Import from exisiting project
      </TabPanel>
      <TabPanel value={value} index={1}>
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
      <TabPanel value={value} index={2}>
        <WorkflowTextEditor workflow={project.workflow} push={workflowPush} />
      </TabPanel>
      <TabPanel value={value} index={3}>
        TODO
      </TabPanel>
    </Paper>
  );
}

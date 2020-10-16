import Paper from "@material-ui/core/Paper";
import React from "react";

import { UseProjectHistoryFnc } from "../../../utils/projects/hooks/useProjectHistory";
import { ProjectDocument } from "../../../utils/projects/types";

export interface ProjectWorkflowFormProps {
  document: ProjectDocument;
  push: UseProjectHistoryFnc;
}

export default function ProjectWorkflowForm(
  props: ProjectWorkflowFormProps,
): JSX.Element {
  const { document, push } = props;
  const { workflow } = document;

  return <Paper></Paper>;
}

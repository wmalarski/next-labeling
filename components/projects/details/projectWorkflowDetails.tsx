import { Typography } from "@material-ui/core";
import React from "react";

import { ProjectDocument } from "../../../utils/projects/types";

export interface ProjectWorkflowDetailsProps {
  id: string;
  project: ProjectDocument;
}

export default function ProjectWorkflowDetails(
  props: ProjectWorkflowDetailsProps,
): JSX.Element {
  const { project } = props;
  const { name } = project;

  return <Typography variant="body2">{`Workflow - ${name}`}</Typography>;
}

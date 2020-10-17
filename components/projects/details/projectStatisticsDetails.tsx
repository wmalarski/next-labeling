import { Typography } from "@material-ui/core";
import React from "react";

import { ProjectDocument } from "../../../utils/projects/types";

export interface ProjectStatisticsDetailsProps {
  id: string;
  project: ProjectDocument;
}

export default function ProjectStatisticsDetails(
  props: ProjectStatisticsDetailsProps,
): JSX.Element {
  const { project } = props;
  const { name } = project;

  return <Typography variant="body2">{`Statistics - ${name}`}</Typography>;
}

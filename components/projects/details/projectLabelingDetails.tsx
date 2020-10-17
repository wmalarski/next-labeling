import { Typography } from "@material-ui/core";
import React from "react";

import { ProjectDocument } from "../../../utils/projects/types";

export interface ProjectLabelingDetailsProps {
  id: string;
  project: ProjectDocument;
}

export default function ProjectLabelingDetails(
  props: ProjectLabelingDetailsProps,
): JSX.Element {
  const { project } = props;
  const { name } = project;

  return <Typography variant="body2">{`Labeling - ${name}`}</Typography>;
}

import { Typography } from "@material-ui/core";
import React from "react";

import { ProjectDocument } from "../../types";

export interface ProjectSettingsDetailsProps {
  id: string;
  project: ProjectDocument;
}

export default function ProjectSettingsDetails(
  props: ProjectSettingsDetailsProps,
): JSX.Element {
  const { project } = props;
  const { name } = project;

  return <Typography variant="body2">{`Settings - ${name}`}</Typography>;
}

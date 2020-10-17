import { Typography } from "@material-ui/core";
import React from "react";

import { ProjectDocument } from "../../../utils/projects/types";

export interface ProjectGeneralDetailsProps {
  id: string;
  project: ProjectDocument;
}

export default function ProjectGeneralDetails(
  props: ProjectGeneralDetailsProps,
): JSX.Element {
  const { project } = props;
  const { name } = project;

  return <Typography variant="body2">{`General - ${name}`}</Typography>;
}

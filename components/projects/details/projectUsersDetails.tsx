import { Typography } from "@material-ui/core";
import React from "react";

import { ProjectDocument } from "../../../utils/projects/types";

export interface ProjectUsersDetailsProps {
  id: string;
  project: ProjectDocument;
}

export default function ProjectUsersDetails(
  props: ProjectUsersDetailsProps,
): JSX.Element {
  const { project } = props;
  const { name } = project;

  return <Typography variant="body2">{`Users - ${name}`}</Typography>;
}

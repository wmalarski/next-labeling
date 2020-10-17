import { Typography } from "@material-ui/core";
import React from "react";

import { ProjectDocument } from "../../../utils/projects/types";

export interface ProjectSchemasDetailsProps {
  id: string;
  project: ProjectDocument;
}

export default function ProjectSchemasDetails(
  props: ProjectSchemasDetailsProps,
): JSX.Element {
  const { project } = props;
  const { name } = project;

  return <Typography variant="body2">{`Schemas - ${name}`}</Typography>;
}

import ListItem from "@material-ui/core/ListItem";
import React from "react";
import { ProjectDocument } from "../../utils/projects/types";

export interface ProjectListItemProps {
  id: string;
  project: ProjectDocument;
}

export default function ProjectListItem(
  props: ProjectListItemProps,
): JSX.Element {
  const { project } = props;

  return <ListItem>{project.name}</ListItem>;
}

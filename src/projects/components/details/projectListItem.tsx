import ListItem from "@material-ui/core/ListItem";
import Paper from "@material-ui/core/Paper/Paper";
import React from "react";
import { useProjectListItemStyles } from "../../styles";
import { ProjectDocument } from "../../types";
import ProjectSmallDetails from "./projectSmallDetails";

export interface ProjectListItemProps {
  id: string;
  project: ProjectDocument;
}

export default function ProjectListItem(
  props: ProjectListItemProps,
): JSX.Element {
  const classes = useProjectListItemStyles();

  return (
    <ListItem>
      <Paper className={classes.paper}>
        <ProjectSmallDetails {...props} />
      </Paper>
    </ListItem>
  );
}

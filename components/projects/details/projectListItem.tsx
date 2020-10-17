import ListItem from "@material-ui/core/ListItem";
import Paper from "@material-ui/core/Paper/Paper";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React from "react";

import { ProjectDocument } from "../../../utils/projects/types";
import ProjectSmallDetails from "./projectSmallDetails";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      width: "100%",
      margin: theme.spacing(2),
      padding: theme.spacing(2),
    },
  }),
);

export interface ProjectListItemProps {
  id: string;
  project: ProjectDocument;
}

export default function ProjectListItem(
  props: ProjectListItemProps,
): JSX.Element {
  const classes = useStyles();

  return (
    <ListItem>
      <Paper className={classes.paper}>
        <ProjectSmallDetails {...props} />
      </Paper>
    </ListItem>
  );
}

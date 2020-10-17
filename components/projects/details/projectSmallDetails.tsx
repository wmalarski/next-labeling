import { Typography } from "@material-ui/core";
import Chip from "@material-ui/core/Chip/Chip";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Link from "next/link";
import React from "react";

import { ProjectDocument } from "../../../utils/projects/types";

const useStyles = makeStyles(() =>
  createStyles({
    column: {
      display: "flex",
      flexDirection: "column",
    },
  }),
);

export interface ProjectSmallDetailsProps {
  id: string;
  project: ProjectDocument;
}

export default function ProjectSmallDetails(
  props: ProjectSmallDetailsProps,
): JSX.Element {
  const classes = useStyles();

  const { project, id } = props;
  const { isPublic, name, description, tags } = project;

  return (
    <div className={classes.column}>
      <div>
        <Typography variant="h5">
          <Link
            href={{
              pathname: "/projects/[projectId]",
              query: { projectId: id },
            }}
          >
            <a>{name}</a>
          </Link>
        </Typography>
        {!isPublic && <Chip label={"Private"} variant="outlined" />}
      </div>
      <Typography variant="body1">{description}</Typography>
      <div>
        {tags.map(tag => (
          <Chip key={tag} label={tag} />
        ))}
      </div>
    </div>
  );
}

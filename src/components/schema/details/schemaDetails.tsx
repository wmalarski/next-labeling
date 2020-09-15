import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";

import { SchemaDocument } from "../../../utils/schema/types";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      margin: theme.spacing(2),
      padding: theme.spacing(2),
    },
    grid: {
      marginTop: theme.spacing(1),
    },
  }),
);

interface SchemaDetailsProps {
  schemaDocument: SchemaDocument;
}

export default function SchemaDetails(props: SchemaDetailsProps): JSX.Element {
  const { schema, user } = props.schemaDocument;
  const classes = useStyles();

  return (
    <Paper className={classes.paper} elevation={3}>
      <Typography variant="h5">{schema.name}</Typography>
      <Typography variant="subtitle2">{`Version: ${schema.version}`}</Typography>
      <Typography variant="subtitle1">{schema.description}</Typography>
      <Typography variant="subtitle2">{`Author: ${user?.displayName}`}</Typography>
      <Divider />
    </Paper>
  );
}

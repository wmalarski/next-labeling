import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

export const useProjectListItemStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      width: "100%",
      margin: theme.spacing(2),
      padding: theme.spacing(2),
    },
  }),
);

export const useProjectSmallDetailsStyles = makeStyles(() =>
  createStyles({
    column: {
      display: "flex",
      flexDirection: "column",
    },
  }),
);

export const useProjectStepsStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    button: {
      marginTop: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    resetContainer: {
      padding: theme.spacing(3),
    },
  }),
);

export const useProjectDetailsPageStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      width: "100%",
      padding: theme.spacing(3),
    },
  }),
);

export const useWorkflowEdgeTableEditorFormStyles = makeStyles(() =>
  createStyles({
    editor: {
      display: "flex",
      flexDirection: "column",
    },
  }),
);

export const useWorkflowNodeTableEditorFormStyles = makeStyles(() =>
  createStyles({
    editor: {
      display: "flex",
      flexDirection: "column",
    },
  }),
);

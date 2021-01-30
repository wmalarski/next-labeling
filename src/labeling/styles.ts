import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

export const useLabelingListItemStyles = makeStyles((theme: Theme) =>
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

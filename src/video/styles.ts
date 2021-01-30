import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

export const useVideoHeaderStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(1),
    },
  }),
);

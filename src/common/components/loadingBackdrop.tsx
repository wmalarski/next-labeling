import Backdrop from "@material-ui/core/Backdrop/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
  }),
);

export interface LoadingBackdropProps {
  isLoading?: boolean;
}

export default function LoadingBackdrop(
  props: LoadingBackdropProps,
): JSX.Element {
  const classes = useStyles();
  return (
    <Backdrop className={classes.backdrop} open={props.isLoading ?? false}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}

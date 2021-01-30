import Backdrop from "@material-ui/core/Backdrop/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import React from "react";
import { useLoadingBackdropStyles } from "../styles";

export interface LoadingBackdropProps {
  isLoading?: boolean;
}

export default function LoadingBackdrop(
  props: LoadingBackdropProps,
): JSX.Element {
  const classes = useLoadingBackdropStyles();
  return (
    <Backdrop className={classes.backdrop} open={props.isLoading ?? false}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}

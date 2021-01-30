import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";
import { ResultSnackbarState } from "../../firebase/types";

export interface ResultSnackbarProps {
  state: ResultSnackbarState;
  setState: (state: ResultSnackbarState) => void;
}

export default function ResultSnackbar(
  props: ResultSnackbarProps,
): JSX.Element {
  const { state, setState } = props;
  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={state.isOpen}
      autoHideDuration={6000}
      onClose={() => setState({ isOpen: false })}
      message={state.message ?? ""}
      action={
        <IconButton
          size="small"
          aria-label="close"
          color="inherit"
          onClick={() => setState({ isOpen: false })}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      }
    />
  );
}

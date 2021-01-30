import { useContext } from "react";
import SnackbarContext, { SnackbarContextState } from "../snackbarContext";

export default function useSnackbar(): SnackbarContextState {
  return useContext(SnackbarContext);
}

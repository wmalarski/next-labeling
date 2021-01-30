import { createContext } from "react";
import { ResultSnackbarState } from "../firebase/types";

export interface SnackbarContextState {
  showSnackbar: (snackbar: ResultSnackbarState) => void;
}

const SnackbarContext = createContext<SnackbarContextState>({
  showSnackbar: () => void 0,
});

export default SnackbarContext;

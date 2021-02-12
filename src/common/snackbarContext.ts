import { createContext } from "react";

export interface ResultSnackbarState {
  isOpen: boolean;
  message?: string;
}

export interface SnackbarContextState {
  showSnackbar: (snackbar: ResultSnackbarState) => void;
}

const SnackbarContext = createContext<SnackbarContextState>({
  showSnackbar: () => void 0,
});

export default SnackbarContext;

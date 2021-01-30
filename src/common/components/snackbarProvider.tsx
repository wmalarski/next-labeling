import React, { useState } from "react";
import { ResultSnackbarState } from "../../firebase/types";
import SnackbarContext from "../snackbarContext";
import ResultSnackbar from "./resultSnackbar";

export interface SnackbarProviderProps {
  children: React.ReactNode;
}

export default function SnackbarProvider(
  props: SnackbarProviderProps,
): JSX.Element {
  const { children } = props;

  const [snackbarState, setSnackbarState] = useState<ResultSnackbarState>({
    isOpen: false,
  });

  return (
    <SnackbarContext.Provider value={{ showSnackbar: setSnackbarState }}>
      {children}
      <ResultSnackbar state={snackbarState} setState={setSnackbarState} />
    </SnackbarContext.Provider>
  );
}

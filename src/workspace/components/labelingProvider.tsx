import firebase from "firebase/app";
import "firebase/firestore";
import React, { useEffect, useMemo } from "react";
import useRouterRemove from "../../common/hooks/useRouterRemove";
import { ResultSnackbarState } from "../../common/snackbarContext";
import { LabelingCollection } from "../../firebase/types";
import LabelingContext from "../contexts/labelingContext";
import useUpdateLabeling from "../hooks/useUpdateLabeling";
import { ExternalDocument } from "../types/database";

export interface LabelingProviderProps {
  documentId: string;
  children: React.ReactNode | React.ReactNode[] | null;
  setSnackbarState: (state: ResultSnackbarState) => void;
}

export default function LabelingProvider(
  props: LabelingProviderProps,
): JSX.Element {
  const { documentId, children, setSnackbarState } = props;

  const collection = firebase.firestore().collection(LabelingCollection);

  const { update: updateLabeling, state: updateState } = useUpdateLabeling();
  useEffect(() => {
    if (updateState.document) {
      setSnackbarState({ isOpen: true, message: "Labeling saved" });
    } else if (updateState.errors) {
      setSnackbarState({ isOpen: true, message: `${updateState.errors}` });
    }
  }, [setSnackbarState, updateState.document, updateState.errors]);

  const { remove } = useRouterRemove({
    setSnackbarState: setSnackbarState,
    backOnSuccess: true,
    collection,
  });

  const contextValue = useMemo(
    () => ({
      saveLabeling: (document: ExternalDocument): void =>
        updateLabeling(documentId, document),
      removeLabeling: (): void => remove(documentId),
    }),
    [documentId, remove, updateLabeling],
  );

  return (
    <LabelingContext.Provider value={contextValue}>
      {children}
    </LabelingContext.Provider>
  );
}

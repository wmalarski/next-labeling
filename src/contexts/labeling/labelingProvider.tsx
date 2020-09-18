import React, { useEffect } from "react";
import LabelingContext from "./labelingContext";
import { LabelingDocument } from "../../utils/labeling/types";
import useUpdateDocument from "../../utils/firestore/useUpdateLabeling";
import {
  LabelingCollection,
  ResultSnackbarState,
} from "../../utils/firestore/types";
import useRemoveDocument from "../../utils/firestore/useRemoveDocument";
import { useRouter } from "next/router";

export interface LabelingProviderProps {
  document: LabelingDocument;
  children: React.ReactNode | React.ReactNode[] | null;
  setSnackbarState: (state: ResultSnackbarState) => void;
}

export default function LabelingProvider(
  props: LabelingProviderProps,
): JSX.Element {
  const { document, children, setSnackbarState } = props;
  const router = useRouter();

  const { update: updateLabeling, state: updateState } = useUpdateDocument<
    LabelingDocument
  >(LabelingCollection);
  useEffect(() => {
    if (updateState.document) {
      setSnackbarState({ isOpen: true, message: "Schema saved" });
    } else if (updateState.errors) {
      setSnackbarState({
        isOpen: true,
        message: `${updateState.errors}`,
      });
    }
  }, [setSnackbarState, updateState.document, updateState.errors]);

  const { remove: removeSchema, state: removeState } = useRemoveDocument(
    LabelingCollection,
  );
  useEffect(() => {
    if (removeState.success) {
      setSnackbarState({ isOpen: true, message: "Schema removed" });
      router.back();
    } else if (removeState.errors) {
      setSnackbarState({
        isOpen: true,
        message: `${removeState.errors}`,
      });
    }
  }, [removeState.errors, removeState.success, router, setSnackbarState]);

  return (
    <LabelingContext.Provider
      value={{
        document,
        pushDoc: () => void 0,
        updateDoc: () => void 0,
        removeDoc: () => void 0,
      }}
    >
      {children}
    </LabelingContext.Provider>
  );
}

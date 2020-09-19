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
import useLabelingHistory from "../../utils/labeling/useLabelingHistory";

export interface LabelingProviderProps {
  document: LabelingDocument;
  children: React.ReactNode | React.ReactNode[] | null;
  setSnackbarState: (state: ResultSnackbarState) => void;
}

export default function LabelingProvider(
  props: LabelingProviderProps,
): JSX.Element {
  const { document: initialDocument, children, setSnackbarState } = props;
  const router = useRouter();

  const history = useLabelingHistory(initialDocument.data);

  const { update: updateLabeling, state: updateState } = useUpdateDocument<
    LabelingDocument
  >(LabelingCollection);
  useEffect(() => {
    if (updateState.document) {
      setSnackbarState({ isOpen: true, message: "Labeling saved" });
    } else if (updateState.errors) {
      setSnackbarState({
        isOpen: true,
        message: `${updateState.errors}`,
      });
    }
  }, [setSnackbarState, updateState.document, updateState.errors]);

  const { remove: removeLabeling, state: removeState } = useRemoveDocument(
    LabelingCollection,
  );
  useEffect(() => {
    if (removeState.success) {
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
        document: { ...initialDocument, data: history.data },
        history,
        pushLabeling: document => {
          if (document.id) {
            updateLabeling(document.id, document);
          }
        },
        removeLabeling: document => {
          if (document.id) {
            removeLabeling(document.id);
          }
        },
      }}
    >
      {children}
    </LabelingContext.Provider>
  );
}

import "firebase/firestore";

import firebase from "firebase/app";
import React, { useEffect, useState } from "react";

import useRouterRemove from "../../utils/common/useRouterRemove";
import {
  LabelingCollection,
  ResultSnackbarState,
} from "../../utils/firestore/types";
import LabelingContext from "../../utils/labeling/contexts/labelingContext";
import useLabelingHistory from "../../utils/labeling/hooks/useLabelingHistory";
import useUpdateLabeling from "../../utils/labeling/hooks/useUpdateLabeling";
import {
  IsDoneFilterValue,
  LabelingDisplayFilters,
} from "../../utils/labeling/types/client";
import { ExternalDocument } from "../../utils/labeling/types/database";

export interface LabelingProviderProps {
  documentId: string;
  document: ExternalDocument;
  children: React.ReactNode | React.ReactNode[] | null;
  setSnackbarState: (state: ResultSnackbarState) => void;
}

export default function LabelingProvider(
  props: LabelingProviderProps,
): JSX.Element {
  const {
    documentId,
    document: initialDocument,
    children,
    setSnackbarState,
  } = props;

  const [document, setDocument] = useState(initialDocument);
  const [duration, setDuration] = useState(1000);
  const history = useLabelingHistory(initialDocument);
  const [filters, setFilters] = useState<LabelingDisplayFilters>({
    isDone: IsDoneFilterValue.ALL,
    objectSchemaIds: initialDocument.schema.objects.map(
      objectSchema => objectSchema.id,
    ),
  });

  const db = firebase.firestore();
  const collection = db.collection(LabelingCollection);

  const { update: updateLabeling, state: updateState } = useUpdateLabeling();
  useEffect(() => {
    if (updateState.document) {
      setDocument(oldState => ({ ...oldState, ...updateState.document }));
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

  return (
    <LabelingContext.Provider
      value={{
        document,
        history,
        duration,
        filters,
        setDuration,
        setFilters,
        saveLabeling: document => updateLabeling(documentId, document),
        removeLabeling: () => remove(documentId),
      }}
    >
      {children}
    </LabelingContext.Provider>
  );
}

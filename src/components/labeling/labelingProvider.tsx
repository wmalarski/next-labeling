import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import {
  LabelingCollection,
  ResultSnackbarState,
} from "../../utils/firestore/types";
import useRemoveDocument from "../../utils/firestore/useRemoveDocument";
import useUpdateDocument from "../../utils/firestore/useUpdateLabeling";
import { ExternalDocument } from "../../utils/labeling/types/database";
import useLabelingHistory from "../../utils/labeling/hooks/useLabelingHistory";
import LabelingContext from "../../utils/labeling/contexts/labelingContext";
import {
  IsDoneFilterValue,
  LabelingDisplayFilters,
} from "../../utils/labeling/types/client";

export interface LabelingProviderProps {
  document: ExternalDocument;
  children: React.ReactNode | React.ReactNode[] | null;
  setSnackbarState: (state: ResultSnackbarState) => void;
}

export default function LabelingProvider(
  props: LabelingProviderProps,
): JSX.Element {
  const { document: initialDocument, children, setSnackbarState } = props;
  const router = useRouter();

  const [document, setDocument] = useState(initialDocument);
  const [duration, setDuration] = useState(1000);
  const history = useLabelingHistory(initialDocument);
  const [filters, setFilters] = useState<LabelingDisplayFilters>({
    isDone: IsDoneFilterValue.ALL,
    objectSchemaIds: initialDocument.schema.objects.map(
      objectSchema => objectSchema.id,
    ),
  });

  const { update: updateLabeling, state: updateState } = useUpdateDocument<
    ExternalDocument
  >(LabelingCollection);
  useEffect(() => {
    if (updateState.document) {
      setDocument(updateState.document);
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
        document,
        history,
        duration,
        filters,
        setDuration,
        setFilters,
        saveLabeling: document => {
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

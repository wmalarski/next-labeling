import "firebase/firestore";

import firebase from "firebase/app";

import { LabelingCollection } from "../../firestore/types";
import useFetchDocument from "../../firestore/hooks/useFetchDocument";
import { ExternalDocument } from "../types/database";
import { useCallback } from "react";

export interface UseFetchLabelingResult {
  isLoading: boolean;
  document?: ExternalDocument;
  exist?: boolean;
  errors?: string[];
}

export default function useFetchLabeling(
  documentId?: string,
): UseFetchLabelingResult {
  const collection = useCallback(
    () => firebase.firestore().collection(LabelingCollection),
    [],
  );

  return useFetchDocument<ExternalDocument>({
    type: ExternalDocument,
    documentId,
    collection,
  });
}

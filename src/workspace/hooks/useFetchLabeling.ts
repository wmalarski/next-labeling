import firebase from "firebase/app";
import "firebase/firestore";
import { useCallback } from "react";
import useFetchDocument from "../../firebase/hooks/useFetchDocument";
import { LabelingCollection } from "../../firebase/types";
import { ExternalDocument } from "../types/database";

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

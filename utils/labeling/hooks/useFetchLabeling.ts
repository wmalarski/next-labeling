import "firebase/firestore";

import firebase from "firebase/app";

import { LabelingCollection } from "../../firestore/types";
import useFetchDocument from "../../firestore/useFetchDocument";
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
  const db = firebase.firestore();
  const collection = db.collection(LabelingCollection);
  return useFetchDocument<ExternalDocument>({
    type: ExternalDocument,
    documentId,
    collection,
  });
}

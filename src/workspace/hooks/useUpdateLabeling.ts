import firebase from "firebase/app";
import "firebase/firestore";
import { useCallback } from "react";
import useAuth from "../../auth/hooks/useAuth";
import useUpdateDocument, {
  UseUpdateDocumentResult,
} from "../../firebase/hooks/useUpdateDocument";
import { LabelingCollection } from "../../firebase/types";
import { ExternalDocument } from "../types/database";

export default function useUpdateLabeling(): UseUpdateDocumentResult<ExternalDocument> {
  const { authUser } = useAuth();

  const db = firebase.firestore();
  const result = useUpdateDocument<ExternalDocument>(
    db.collection(LabelingCollection),
  );
  const resultUpdate = result.update;

  const update = useCallback(
    (
      documentId: string,
      document: Partial<ExternalDocument>,
      options?: firebase.firestore.SetOptions,
    ) => {
      if (!authUser) return;
      resultUpdate(documentId, document, { merge: true, ...(options ?? {}) });
    },
    [authUser, resultUpdate],
  );

  return { ...result, update };
}

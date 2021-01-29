import "firebase/firestore";

import firebase from "firebase/app";
import { useCallback } from "react";

import { useAuthUserInfo } from "../../auth/hooks";
import { LabelingCollection } from "../../firestore/types";
import useUpdateDocument, {
  UseUpdateDocumentResult,
} from "../../firestore/useUpdateDocument";
import { ExternalDocument } from "../types/database";

export default function useUpdateLabeling(): UseUpdateDocumentResult<ExternalDocument> {
  const { authUser } = useAuthUserInfo();

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

import "firebase/firestore";

import firebase from "firebase/app";
import { useCallback } from "react";

import { useAuthUserInfo } from "../../auth/hooks";
import { LabelingCollection } from "../../firestore/types";
import useUpdateDocument, {
  UseUpdateDocumentResult,
} from "../../firestore/useUpdateDocument";
import { ExternalDocument } from "../types/database";
import useLabelingContext from "./useLabelingContext";

export default function useUpdateLabeling(): UseUpdateDocumentResult<
  ExternalDocument
> {
  const { document: orgDocument } = useLabelingContext();
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
      resultUpdate(
        documentId,
        {
          ...document,
          edited: [
            ...orgDocument.edited,
            {
              date: new Date().toLocaleString(),
              user: authUser,
            },
          ],
        },
        { merge: true, ...(options ?? {}) },
      );
    },
    [authUser, orgDocument.edited, resultUpdate],
  );

  return { ...result, update };
}

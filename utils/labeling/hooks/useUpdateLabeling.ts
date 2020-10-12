import "firebase/firestore";

import firebase from "firebase/app";
import { useCallback, useContext } from "react";
import { ExternalDocument } from "../types/database";
import useUpdateDocument, {
  UseUpdateDocumentResult,
} from "../../firestore/useUpdateDocument";
import { LabelingCollection } from "../../firestore/types";
import useLabelingContext from "./useLabelingContext";
import { AuthUserInfoContext } from "../../auth/hooks";

export default function useUpdateLabeling(): UseUpdateDocumentResult<
  ExternalDocument
> {
  const { document: orgDocument } = useLabelingContext();
  const { authUser } = useContext(AuthUserInfoContext);

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

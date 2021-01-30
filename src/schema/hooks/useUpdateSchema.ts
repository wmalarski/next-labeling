import firebase from "firebase/app";
import "firebase/firestore";
import { useCallback } from "react";
import useUpdateDocument, {
  UseUpdateDocumentResult,
} from "../../firebase/hooks/useUpdateDocument";
import { SchemaCollection } from "../../firebase/types";
import { SchemaDocument } from "../types";

export default function useUpdateSchema(): UseUpdateDocumentResult<SchemaDocument> {
  const db = firebase.firestore();
  const result = useUpdateDocument<SchemaDocument>(
    db.collection(SchemaCollection),
  );
  const resultUpdate = result.update;

  const update = useCallback(
    (
      documentId: string,
      document: Partial<SchemaDocument>,
      options?: firebase.firestore.SetOptions,
    ) =>
      resultUpdate(
        documentId,
        {
          ...document,
          editedAt: firebase.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true, ...(options ?? {}) },
      ),
    [resultUpdate],
  );

  return { ...result, update };
}

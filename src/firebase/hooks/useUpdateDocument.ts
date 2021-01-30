import "firebase/firestore";

import { useCallback, useState } from "react";
import firebase from "firebase/app";
import { FirestoreCollection } from "../types";

export interface UseUpdateDocumentState<T> {
  isLoading: boolean;
  document?: Partial<T>;
  errors?: string[];
}

export interface UseUpdateDocumentResult<T> {
  update: (
    documentId: string,
    document: Partial<T>,
    options?: firebase.firestore.SetOptions,
  ) => void;
  state: UseUpdateDocumentState<T>;
}

export default function useUpdateDocument<T>(
  collection: FirestoreCollection,
): UseUpdateDocumentResult<T> {
  const [state, setState] = useState<UseUpdateDocumentState<T>>({
    isLoading: false,
  });

  const update = useCallback(
    (
      documentId: string,
      document: Partial<T>,
      options?: firebase.firestore.SetOptions,
    ): void => {
      setState({ isLoading: true });
      const doc = collection.doc(documentId);
      (options ? doc.set(document, options) : doc.set(document))
        .then(() => setState({ document, isLoading: false }))
        .catch(reason =>
          setState({ errors: [`${reason.toString()}`], isLoading: false }),
        );
    },
    [collection],
  );

  return { update, state };
}

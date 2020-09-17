import "firebase/firestore";

import firebase from "firebase/app";
import { useCallback, useState } from "react";

export interface UseUpdateDocumentState<T> {
  isLoading: boolean;
  document?: T;
  errors?: string[];
}

export interface UseUpdateDocumentResult<T> {
  update: (documentId: string, document: T) => void;
  state: UseUpdateDocumentState<T>;
}

export default function useUpdateDocument<T>(
  collection: string,
): UseUpdateDocumentResult<T> {
  const [state, setState] = useState<UseUpdateDocumentState<T>>({
    isLoading: false,
  });

  const update = useCallback(
    (documentId: string, document: T): void => {
      const db = firebase.firestore();
      setState({ isLoading: true });
      db.collection(collection)
        .doc(documentId)
        .set({ ...document, created: new Date().toJSON() })
        .then(() => setState({ document, isLoading: false }))
        .catch(reason =>
          setState({ errors: [`${reason.toString()}`], isLoading: false }),
        );
    },
    [collection],
  );

  return { update, state };
}

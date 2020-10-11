import "firebase/firestore";

import { useCallback, useState } from "react";

import { FirestoreCollection } from "./types";

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
  collection: FirestoreCollection,
): UseUpdateDocumentResult<T> {
  const [state, setState] = useState<UseUpdateDocumentState<T>>({
    isLoading: false,
  });

  const update = useCallback(
    (documentId: string, document: T): void => {
      setState({ isLoading: true });
      collection
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

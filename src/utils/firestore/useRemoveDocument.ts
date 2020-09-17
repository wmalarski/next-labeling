import "firebase/firestore";

import firebase from "firebase/app";
import { useCallback, useState } from "react";

export interface UseRemoveDocumentState {
  success?: boolean;
  isLoading: boolean;
  errors?: string[];
}

export interface UseRemoveDocumentResult {
  remove: (documentId: string) => void;
  state: UseRemoveDocumentState;
}

export default function useRemoveDocument(
  collection: string,
): UseRemoveDocumentResult {
  const [state, setState] = useState<UseRemoveDocumentState>({
    isLoading: false,
  });

  const remove = useCallback(
    (documentId: string): void => {
      setState({ isLoading: true });
      const db = firebase.firestore();
      db.collection(collection)
        .doc(documentId)
        .delete()
        .then(() =>
          setState({
            success: true,
            isLoading: false,
          }),
        )
        .catch(reason =>
          setState({
            success: false,
            errors: [`${reason.toString()}`],
            isLoading: false,
          }),
        );
    },
    [collection],
  );

  return { remove, state };
}

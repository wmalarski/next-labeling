import "firebase/firestore";

import { useCallback, useState } from "react";
import { FirestoreCollection } from "./types";

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
  collection: FirestoreCollection,
): UseRemoveDocumentResult {
  const [state, setState] = useState<UseRemoveDocumentState>({
    isLoading: false,
  });

  const remove = useCallback(
    (documentId: string): void => {
      setState({ isLoading: true });
      collection
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

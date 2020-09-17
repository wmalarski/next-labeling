import "firebase/firestore";

import firebase from "firebase/app";
import { useCallback, useState } from "react";

export interface UseCreateDocumentState<T> {
  isLoading: boolean;
  document?: T;
  errors?: string[];
}

export interface UseCreateDocumentResult<T> {
  create: (document: Partial<T>) => void;
  state: UseCreateDocumentState<T>;
}

export default function useCreateDocument<T>(
  collection: string,
): UseCreateDocumentResult<T> {
  const [state, setState] = useState<UseCreateDocumentState<T>>({
    isLoading: false,
  });

  const create = useCallback(
    document => {
      setState({
        isLoading: true,
      });
      const db = firebase.firestore();
      db.collection(collection)
        .add(document)
        .then(snap =>
          setState({
            document: { ...document, id: snap.id },
            isLoading: false,
          }),
        )
        .catch(reason =>
          setState({ errors: [`${reason.toString()}`], isLoading: false }),
        );
    },
    [collection],
  );

  return { create, state };
}

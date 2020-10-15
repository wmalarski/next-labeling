import "firebase/firestore";

import { useCallback, useState } from "react";

import { FirestoreCollection } from "./types";

export interface UseCreateDocumentState<T> {
  isLoading: boolean;
  id?: string;
  document?: T;
  errors?: string[];
}

export interface UseCreateDocumentResult<T> {
  create: (document: Partial<T>) => void;
  state: UseCreateDocumentState<T>;
}

export default function useCreateDocument<T>(
  collection: FirestoreCollection,
): UseCreateDocumentResult<T> {
  const [state, setState] = useState<UseCreateDocumentState<T>>({
    isLoading: false,
  });

  const create = useCallback(
    document => {
      setState({
        isLoading: true,
      });
      collection
        .add(document)
        .then(snap =>
          setState({
            id: snap.id,
            document,
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

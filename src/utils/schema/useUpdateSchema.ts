import "firebase/firestore";

import firebase from "firebase/app";
import { useCallback, useState } from "react";

import { SchemaDocument } from "./types";

export interface UseUpdateSchemaState {
  isLoading: boolean;
  document?: SchemaDocument;
  errors?: string[];
}

export interface UseUpdateSchemaResult {
  update: (documentId: string, document: SchemaDocument) => void;
  state: UseUpdateSchemaState;
}

export default function useUpdateSchema(): UseUpdateSchemaResult {
  const [state, setState] = useState<UseUpdateSchemaState>({
    isLoading: false,
  });

  const update = useCallback(
    (documentId: string, document: SchemaDocument): void => {
      const db = firebase.firestore();
      setState({ isLoading: true });
      db.collection("spaces")
        .doc(documentId)
        .set({ ...document, created: new Date().toJSON() })
        .then(() => setState({ document, isLoading: false }))
        .catch(reason =>
          setState({ errors: [`${reason.toString()}`], isLoading: false }),
        );
    },
    [],
  );

  return { update, state };
}

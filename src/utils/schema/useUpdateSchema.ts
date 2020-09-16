import "firebase/firestore";

import firebase from "firebase/app";
import { useCallback, useState } from "react";

import { SchemaDocument } from "./types";

export interface UseUpdateSchemaState {
  document?: SchemaDocument;
  errors?: string[];
}

export interface UseUpdateSchemaResult {
  update: (documentId: string, document: SchemaDocument) => void;
  state: UseUpdateSchemaState;
}

export default function useUpdateSchema(): UseUpdateSchemaResult {
  const [state, setState] = useState<UseUpdateSchemaState>({});

  const update = useCallback(
    (documentId: string, document: SchemaDocument): void => {
      const db = firebase.firestore();
      db.collection("spaces")
        .doc(documentId)
        .set({ ...document, created: new Date().toJSON() })
        .then(() => setState({ document }))
        .catch(reason => setState({ errors: [`${reason.toString()}`] }));
    },
    [],
  );

  return { update, state };
}

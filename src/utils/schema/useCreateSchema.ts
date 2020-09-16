import "firebase/firestore";

import firebase from "firebase/app";
import { useCallback, useState } from "react";

import { SchemaDocument } from "./types";

export interface UseCreateSchemaState {
  document?: SchemaDocument;
  errors?: string[];
}

export interface UseCreateSchemaResult {
  create: (document: Partial<SchemaDocument>) => void;
  state: UseCreateSchemaState;
}

export default function useCreateSchema(): UseCreateSchemaResult {
  const [state, setState] = useState<UseCreateSchemaState>({});

  const create = useCallback(document => {
    const db = firebase.firestore();
    db.collection("spaces")
      .add(document)
      .then(snap => setState({ document: { ...document, id: snap.id } }))
      .catch(reason => setState({ errors: [`${reason.toString()}`] }));
  }, []);

  return { create, state };
}

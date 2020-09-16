import "firebase/firestore";

import firebase from "firebase/app";
import { useCallback, useState } from "react";

import { SchemaDocument } from "./types";

export interface UseCreateSchemaState {
  isLoading: boolean;
  document?: SchemaDocument;
  errors?: string[];
}

export interface UseCreateSchemaResult {
  create: (document: Partial<SchemaDocument>) => void;
  state: UseCreateSchemaState;
}

export default function useCreateSchema(): UseCreateSchemaResult {
  const [state, setState] = useState<UseCreateSchemaState>({
    isLoading: false,
  });

  const create = useCallback(document => {
    setState({
      isLoading: true,
    });
    const db = firebase.firestore();
    db.collection("spaces")
      .add(document)
      .then(snap =>
        setState({ document: { ...document, id: snap.id }, isLoading: false }),
      )
      .catch(reason =>
        setState({ errors: [`${reason.toString()}`], isLoading: false }),
      );
  }, []);

  return { create, state };
}

import "firebase/firestore";

import firebase from "firebase/app";
import { useCallback, useState } from "react";

export interface UseRemoveSchemaState {
  success?: boolean;
  errors?: string[];
}

export interface UseRemoveSchemaResult {
  remove: (documentId: string) => void;
  state: UseRemoveSchemaState;
}

export default function useRemoveSchema(): UseRemoveSchemaResult {
  const [state, setState] = useState<UseRemoveSchemaState>({});

  const remove = useCallback((documentId: string): void => {
    const db = firebase.firestore();
    db.collection("spaces")
      .doc(documentId)
      .delete()
      .then(() =>
        setState({
          success: true,
        }),
      )
      .catch(reason =>
        setState({
          success: false,
          errors: [`${reason.toString()}`],
        }),
      );
  }, []);

  return { remove, state };
}

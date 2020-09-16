import "firebase/firestore";

import firebase from "firebase/app";
import { useCallback, useState } from "react";

export interface UseRemoveSchemaState {
  success?: boolean;
  isLoading: boolean;
  errors?: string[];
}

export interface UseRemoveSchemaResult {
  remove: (documentId: string) => void;
  state: UseRemoveSchemaState;
}

export default function useRemoveSchema(): UseRemoveSchemaResult {
  const [state, setState] = useState<UseRemoveSchemaState>({
    isLoading: false,
  });

  const remove = useCallback((documentId: string): void => {
    setState({ isLoading: true });
    const db = firebase.firestore();
    db.collection("spaces")
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
  }, []);

  return { remove, state };
}

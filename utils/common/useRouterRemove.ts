import "firebase/firestore";
import { useRouter } from "next/router";

import { useEffect } from "react";

import { FirestoreCollection, ResultSnackbarState } from "../firestore/types";
import useRemoveDocument from "../firestore/useRemoveDocument";

export interface UseRouterRemoveResult {
  remove: (id: string) => void;
  isLoading: boolean;
}

export interface UseRouterRemoveProps {
  backOnSuccess: boolean;
  successMessage?: string;
  collection: FirestoreCollection;
  setSnackbarState: (state: ResultSnackbarState) => void;
}

export default function useRouterRemove(
  props: UseRouterRemoveProps,
): UseRouterRemoveResult {
  const { backOnSuccess, collection, successMessage, setSnackbarState } = props;
  const { remove, state } = useRemoveDocument(collection);
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      if (backOnSuccess) router.back();
      else setSnackbarState({ isOpen: true, message: successMessage });
    } else if (state.errors) {
      setSnackbarState({
        isOpen: true,
        message: `${state.errors}`,
      });
    }
  }, [
    backOnSuccess,
    router,
    setSnackbarState,
    state.errors,
    state.success,
    successMessage,
  ]);

  return { isLoading: state.isLoading, remove };
}

import "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useCreateDocument from "../../firestore/hooks/useCreateDocument";
import {
  FirestoreCollection,
  ResultSnackbarState,
} from "../../firestore/types";

export interface UseCreateDocumentResult<T> {
  create: (document: Partial<T>) => void;
  isLoading: boolean;
}

export interface UseCreateDocumentOptions<T> {
  collection: FirestoreCollection;
  setSnackbarState: (state: ResultSnackbarState) => void;
  routerOptions: (document: T, id: string) => { url: string; as: string };
}

export default function useRouterCreate<T>(
  options: UseCreateDocumentOptions<T>,
): UseCreateDocumentResult<T> {
  const { collection, setSnackbarState, routerOptions } = options;
  const {
    create,
    state: { isLoading, document, errors, id },
  } = useCreateDocument<T>(collection);
  const router = useRouter();

  useEffect(() => {
    if (document && id) {
      const { url, as } = routerOptions(document, id);
      router.push(url, as);
    } else if (errors) {
      setSnackbarState({
        isOpen: true,
        message: `${errors}`,
      });
    }
  }, [document, errors, id, router, routerOptions, setSnackbarState]);

  return { create, isLoading };
}

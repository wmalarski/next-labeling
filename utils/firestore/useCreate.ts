import "firebase/firestore";

import { useRouter } from "next/router";
import { useEffect } from "react";

import { FirestoreCollection, ResultSnackbarState } from "./types";
import useCreateDocument from "./useCreateDocument";

export interface UseCreateDocumentState<T> {
  isLoading: boolean;
  document?: T;
  errors?: string[];
}

export interface UseCreateDocumentResult<T> {
  create: (document: Partial<T>) => void;
  isLoading: boolean;
}

export interface UseCreateDocumentOptions<T> {
  collection: FirestoreCollection;
  setSnackbarState: (state: ResultSnackbarState) => void;
  routerOptions: (document: T) => { url: string; as: string };
}

export default function useCreate<T>(
  options: UseCreateDocumentOptions<T>,
): UseCreateDocumentResult<T> {
  const { collection, setSnackbarState, routerOptions } = options;
  const {
    create,
    state: { isLoading, document, errors },
  } = useCreateDocument<T>(collection);
  const router = useRouter();

  useEffect(() => {
    if (document) {
      const { url, as } = routerOptions(document);
      router.push(url, as);
    } else if (errors) {
      setSnackbarState({
        isOpen: true,
        message: `${errors}`,
      });
    }
  }, [document, errors, router, routerOptions, setSnackbarState]);

  return { create, isLoading };
}

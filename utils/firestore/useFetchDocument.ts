import "firebase/firestore";

import * as t from "io-ts";
import { PathReporter } from "io-ts/lib/PathReporter";
import { useEffect, useState } from "react";

import { FirestoreCollection } from "./types";

export interface UseFetchDocumentResult<T> {
  isLoading: boolean;
  document?: T;
  exist?: boolean;
  errors?: string[];
}

export interface UseFetchDocumentProps<T> {
  collection: FirestoreCollection;
  documentId?: string;
  type: t.Type<T>;
}

export default function useFetchDocument<T>(
  props: UseFetchDocumentProps<T>,
): UseFetchDocumentResult<T> {
  const { collection, documentId, type } = props;

  const [state, setState] = useState<UseFetchDocumentResult<T>>({
    isLoading: true,
  });

  useEffect(() => {
    if (!documentId) {
      setState({
        isLoading: false,
        exist: false,
      });
      return;
    }
    collection
      .doc(documentId)
      .get()
      .then(doc => {
        const data = doc.data();
        if (!doc.exists || !data) {
          setState({
            isLoading: false,
            exist: false,
          });
          return;
        }
        const decoded = type.decode(data);
        const errors =
          decoded._tag === "Left" ? PathReporter.report(decoded) : [];
        setState({
          isLoading: false,
          exist: true,
          errors,
          document: type.encode(data as T),
        });
      });
  }, [collection, documentId, type]);

  return state;
}

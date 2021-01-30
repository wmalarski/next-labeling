import firebase from "firebase/app";
import * as t from "io-ts";
import compact from "lodash/compact";
import last from "lodash/last";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { FirestoreQuery } from "../types";

export interface UseFetchDocumentsPair<T> {
  id: string;
  document: T;
}

export interface UseFetchDocumentsResult<T> {
  loading: boolean;
  error?: Error;
  items: UseFetchDocumentsPair<T>[];
  fetchMore: () => void;
}

export interface UseFetchDocumentsProps<T> {
  query: FirestoreQuery;
  type: t.Type<T>;
  options?: {
    limit?: number;
  };
}

export default function useFetchDocuments<T>(
  props: UseFetchDocumentsProps<T>,
): UseFetchDocumentsResult<T> {
  const { query, options } = props;
  const { limit = 5 } = options ?? {};

  const [page, setPage] = useState<number>(0);
  const [documents, setDocuments] = useState<
    firebase.firestore.DocumentSnapshot[]
  >([]);

  const cursor = useMemo(
    () => (page === 0 ? null : documents[page * limit] ?? last(documents)),
    [documents, limit, page],
  );

  const collection = useMemo(
    () => (!cursor ? query : query.startAfter(cursor)).limit(limit),
    [cursor, limit, query],
  );

  const [snapshot, loading, error] = useCollection(collection);

  const fetchMore = useCallback(() => setPage(value => value + 1), []);

  useEffect(
    () =>
      setDocuments(currentDocuments => {
        if (!snapshot?.docs) return currentDocuments;

        const currentIds = currentDocuments.map(doc => doc.id);
        const newDocs = snapshot.docs.filter(
          (doc: firebase.firestore.QueryDocumentSnapshot) =>
            !currentIds.includes(doc.id),
        );

        return newDocs.length === 0
          ? currentDocuments
          : [...currentDocuments, ...snapshot.docs];
      }),
    [snapshot?.docs],
  );

  const items = useMemo(
    () =>
      compact(
        documents.map(doc => {
          const data = doc.data() as T;
          if (!data) return null;
          return { id: doc.id, document: data };
        }),
      ),
    [documents],
  );

  return {
    fetchMore,
    error,
    loading,
    items,
  };
}

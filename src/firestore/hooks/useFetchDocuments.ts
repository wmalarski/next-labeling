import "firebase/firestore";

import * as t from "io-ts";
import compact from "lodash/compact";
import { useCallback, useEffect, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";

import { FirestoreQuery } from "../types";

export interface UseFetchDocumentsPair<T> {
  id: string;
  document: T;
}

export interface UseFetchDocumentsResult<T> {
  loading: boolean;
  error?: Error;
  hasMore?: boolean;
  items: UseFetchDocumentsPair<T>[];
  loadMore: () => void;
  resetQuery: (query: FirestoreQuery) => void;
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
  const { query, type, options } = props;
  const { limit = 25 } = options ?? {};

  const [ref, setRef] = useState<FirestoreQuery>(query);
  const [items, setItems] = useState<UseFetchDocumentsPair<T>[]>([]);
  const [snapshot, loading, error] = useCollection(ref.limit(limit));
  const hasMore = snapshot && snapshot?.size === limit;

  useEffect(() => {
    setRef(query);
    setItems([]);
  }, [query]);

  useEffect(
    () =>
      setItems((curr): any => {
        // TODO remove any fix this
        return !snapshot || loading
          ? curr
          : [
              ...curr,
              ...compact(
                snapshot?.docs.map((item: any) => {
                  const data: T = item.data();
                  if (!item.exists || !data) {
                    return;
                  }
                  // const decoded = type.decode(data);
                  // if (decoded._tag === "Left") {
                  //   console.log("Error", decoded.left);
                  //   return;
                  // }
                  return {
                    id: item.id,
                    document: type.encode(data as T),
                  };
                }) ?? [],
              ),
            ];
      }),
    // snapshot?.docs is always changing
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loading, type],
  );

  const loadMore = useCallback(
    () =>
      setRef(curr => {
        const lastDocument = !snapshot?.empty
          ? snapshot?.docs[snapshot?.size - 1]
          : undefined;
        return !lastDocument ? curr : curr.startAfter(lastDocument);
      }),
    [snapshot?.docs, snapshot?.empty, snapshot?.size],
  );
  const resetQuery = useCallback(query => setRef(query), []);
  return { hasMore, error, loading, items, loadMore, resetQuery };
}

import "firebase/firestore";

import usePagination from "firestore-pagination-hook";
import * as t from "io-ts";
import compact from "lodash/compact";
import { useMemo } from "react";
import { FirestoreQuery } from "./types";

export interface UseFetchDocumentsResult<T> {
  loadingMore: boolean;
  loadingError: Error;
  loadingMoreError: Error;
  loading: boolean;
  hasMore: boolean;
  items: {
    id: string;
    document: T;
  }[];
  loadMore: () => void;
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

  const pagination = usePagination(query, options);

  const items = useMemo(
    () =>
      compact(
        pagination.items.map(item => {
          const data = item.data();
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
        }),
      ),
    [pagination.items, type],
  );

  return { ...pagination, items };
}

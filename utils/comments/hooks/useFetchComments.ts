import "firebase/firestore";

import firebase from "firebase/app";
import usePagination from "firestore-pagination-hook";

import { CommentsCollection, LabelingCollection } from "../../firestore/types";
import { CommentDocument } from "../types";
import { useMemo } from "react";

export interface UseFetchCommentsResult {
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  comments: CommentDocument[];
  loadMore: () => void;
}

export default function useFetchComments(
  labelingDocumentId: string,
): UseFetchCommentsResult {
  const db = firebase.firestore();
  const {
    loading,
    loadingMore,
    hasMore,
    items,
    loadMore,
  } = usePagination(
    db
      .collection(LabelingCollection)
      .doc(labelingDocumentId)
      .collection(CommentsCollection),
    { limit: 10 },
  );

  const comments: CommentDocument[] = useMemo(
    () =>
      items.flatMap(doc => {
        const data = doc.data();
        const decoded = CommentDocument.decode(data);
        if (decoded._tag === "Left") return [];
        return [{ ...CommentDocument.encode(data), id: doc.id }];
      }),
    [items],
  );

  return {
    loading,
    loadingMore,
    hasMore,
    loadMore,
    comments,
  };
}

import "firebase/firestore";

import firebase from "firebase/app";
import usePagination from "firestore-pagination-hook";
import compact from "lodash/compact";
import { useMemo } from "react";

import { CommentsCollection, LabelingCollection } from "../../firestore/types";
import { decodeCommentDocument } from "../functions";
import { CommentDocument } from "../types";

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
      .collection(CommentsCollection)
      .orderBy("createdAt"),
    { limit: 10 },
  );

  const comments: CommentDocument[] = useMemo(
    () => compact(items.map(decodeCommentDocument)),
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

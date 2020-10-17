import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import firebase from "firebase/app";
import usePagination from "firestore-pagination-hook";
import compact from "lodash/compact";
import React, { useMemo } from "react";

import { decodeCommentDocument } from "../../utils/comments/functions";
import {
  CommentDocument,
  CommentDocumentPair,
} from "../../utils/comments/types";
import {
  CommentsCollection,
  LabelingCollection,
} from "../../utils/firestore/types";
import useCreateDocument from "../../utils/firestore/useCreateDocument";
import CommentInput from "./commentInput";
import CommentListItem from "./commentListItem";

export interface CommentListProps {
  documentId: string;
}

export default function CommentList(props: CommentListProps): JSX.Element {
  const { documentId } = props;

  const db = firebase.firestore();
  const collection = db
    .collection(LabelingCollection)
    .doc(documentId)
    .collection(CommentsCollection);

  const { create, state } = useCreateDocument<CommentDocument>(collection);

  const {
    loading,
    loadingMore,
    hasMore,
    items,
    loadMore,
  } = usePagination(collection.orderBy("createdAt"), { limit: 10 });

  const comments: CommentDocumentPair[] = useMemo(
    () => compact(items.map(decodeCommentDocument)),
    [items],
  );

  return (
    <>
      <List>
        {comments.map(pair => (
          <CommentListItem
            key={pair.id}
            commentId={pair.id}
            comment={pair.comment}
            labelingId={documentId}
          />
        ))}
        <ListItem>{(loading || loadingMore) && <CircularProgress />}</ListItem>
      </List>
      {hasMore && !state.isLoading && (
        <Button variant="outlined" onClick={loadMore}>
          Load more
        </Button>
      )}
      <CommentInput
        onSave={comment => {
          loadMore();
          create(comment);
        }}
      />
    </>
  );
}

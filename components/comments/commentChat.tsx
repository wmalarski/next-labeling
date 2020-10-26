import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import firebase from "firebase/app";
import React from "react";

import { CommentDocument } from "../../utils/comments/types";
import {
  CommentsCollection,
  LabelingCollection,
} from "../../utils/firestore/types";
import useCreateDocument from "../../utils/firestore/useCreateDocument";
import useFetchDocuments from "../../utils/firestore/useFetchDocuments";
import CommentInput from "./commentInput";
import CommentListItem from "./commentListItem";

export interface CommentChatProps {
  documentId: string;
}

export default function CommentChat(props: CommentChatProps): JSX.Element {
  const { documentId } = props;

  const collection = firebase
    .firestore()
    .collection(LabelingCollection)
    .doc(documentId)
    .collection(CommentsCollection);

  const { create, state } = useCreateDocument<CommentDocument>(collection);

  const query = collection.orderBy("createdAt");
  const { loading, loadingMore, hasMore, items, loadMore } = useFetchDocuments({
    query,
    type: CommentDocument,
    options: { limit: 10 },
  });

  return (
    <>
      <List>
        {items.map(pair => (
          <CommentListItem
            key={pair.id}
            commentId={pair.id}
            comment={pair.document}
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

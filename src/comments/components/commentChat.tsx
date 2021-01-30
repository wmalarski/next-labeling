import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import firebase from "firebase/app";
import React from "react";
import useCreateDocument from "../../firebase/hooks/useCreateDocument";
import useFetchDocuments from "../../firebase/hooks/useFetchDocuments";
import { CommentsCollection, LabelingCollection } from "../../firebase/types";
import { CommentDocument } from "../types";
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
  const { loading, items, fetchMore } = useFetchDocuments({
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
        <ListItem>{loading && <CircularProgress />}</ListItem>
      </List>
      {!state.isLoading && (
        <Button variant="outlined" onClick={fetchMore}>
          Load more
        </Button>
      )}
      <CommentInput
        onSave={comment => {
          create(comment);
          fetchMore();
        }}
      />
    </>
  );
}

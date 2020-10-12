import List from "@material-ui/core/List";
import React from "react";

import useFetchComments from "../../utils/comments/hooks/useFetchComments";
import CommentInput from "./commentInput";
import CommentListItem from "./commentListItem";

export interface CommentListProps {
  documentId: string;
}

export default function CommentList(props: CommentListProps): JSX.Element {
  const { documentId } = props;

  const { comments } = useFetchComments(documentId);

  return (
    <>
      <List>
        {comments.map(comment => (
          <CommentListItem
            key={comment.id}
            comment={comment}
            labelingId={documentId}
          />
        ))}
      </List>
      <CommentInput documentId={documentId} />
    </>
  );
}

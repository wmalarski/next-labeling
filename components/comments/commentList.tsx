import React from "react";
import useFetchComments from "../../utils/comments/hooks/useFetchComments";
import CommentInput from "./commentInput";

export interface CommentListProps {
  documentId: string;
}

export default function CommentList(props: CommentListProps): JSX.Element {
  const { documentId } = props;

  const { comments } = useFetchComments(documentId);

  console.log({ comments });

  return (
    <>
      {comments.map(comment => (
        <p key={comment.id}>{comment.message}</p>
      ))}
      <CommentInput documentId={documentId} />
    </>
  );
}

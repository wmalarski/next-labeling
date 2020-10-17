import ListItem from "@material-ui/core/ListItem";
import React from "react";

import { CommentDocument } from "../../utils/comments/types";
import ActionListItem from "./actionListItem";
import CommentCard from "./commentCard";

export interface CommentListItemProps {
  commentId: string;
  labelingId: string;
  comment: CommentDocument;
}

export default function CommentListItem(
  props: CommentListItemProps,
): JSX.Element {
  const { comment } = props;

  return (
    <ListItem>
      {!comment.isAction ? (
        <CommentCard {...props} />
      ) : (
        <ActionListItem comment={comment} />
      )}
    </ListItem>
  );
}

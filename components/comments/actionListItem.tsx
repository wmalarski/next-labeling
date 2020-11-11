import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import React from "react";
import { CommentDocument } from "../../utils/comments/types";
import { convertToDate } from "../../utils/firestore/functions";

export interface ActionListItemProps {
  comment: CommentDocument;
}

export default function ActionListItem(
  props: ActionListItemProps,
): JSX.Element {
  const { comment } = props;
  const { createdAt, user, message } = comment;

  const createdAtStr = convertToDate(createdAt)?.toLocaleString() ?? "-";

  return (
    <ListItem>
      <ListItemText
        data-testid="list-item-text"
        primary={user.displayName}
        secondary={
          <>
            {createdAtStr}
            <br />
            {message}
          </>
        }
      />
    </ListItem>
  );
}
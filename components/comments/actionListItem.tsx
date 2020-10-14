import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
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
    <ListItemText
      primary={user.displayName}
      secondary={
        <>
          <Typography variant="body2">{createdAtStr}</Typography>
          <br />
          {message}
        </>
      }
    />
  );
}

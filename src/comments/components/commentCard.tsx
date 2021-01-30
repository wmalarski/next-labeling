import { Divider } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Chip from "@material-ui/core/Chip";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField/TextField";
import Typography from "@material-ui/core/Typography";
import ClearIcon from "@material-ui/icons/Clear";
import DoneIcon from "@material-ui/icons/Done";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import React, { useState } from "react";
import { useAuthUserInfo } from "../../auth/hooks";
import { convertToDate } from "../../firestore/functions";
import useLabelingContext from "../../workspace/hooks/useLabelingContext";
import setSnapshotUpdate from "../../workspace/updates/setSnapshotUpdate";
import useUpdateComment from "../hooks/useUpdateComment";
import { CommentDocument } from "../types";

export interface CommentCardProps {
  commentId: string;
  labelingId: string;
  comment: CommentDocument;
}

export default function CommentCard(props: CommentCardProps): JSX.Element {
  const { comment, commentId, labelingId } = props;
  const {
    createdAt,
    isResolved,
    isThread,
    isEdited,
    snapshot,
    user,
    message,
  } = comment;

  const { history, document } = useLabelingContext();
  const { authUser } = useAuthUserInfo();
  const { pushLabeling } = history;
  const { update } = useUpdateComment(labelingId);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newMessage, setNewMessage] = useState<string>(message);

  const createdAtStr = convertToDate(createdAt)?.toLocaleString() ?? "-";
  const isAuthor = user.id === authUser?.id;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <Card>
      <CardHeader
        action={
          <>
            {isThread && (
              <Chip
                color={isResolved ? "primary" : "default"}
                label={isResolved ? "Unresolve" : "Resolve"}
                onClick={() => {
                  if (!commentId) return;
                  update(
                    commentId,
                    { isResolved: !isResolved },
                    { merge: true },
                  );
                }}
              />
            )}
            <IconButton aria-label="settings" onClick={handleClick}>
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {isAuthor && (
                <MenuItem
                  onClick={() => {
                    setIsEditing(true);
                    handleClose();
                  }}
                >
                  Edit
                </MenuItem>
              )}
              {snapshot && (
                <MenuItem
                  onClick={() => {
                    if (!snapshot) return;
                    pushLabeling(data =>
                      setSnapshotUpdate(data, document.schema, snapshot),
                    );
                    handleClose();
                  }}
                >
                  Snapshot
                </MenuItem>
              )}
              <MenuItem disabled onClick={handleClose}>
                Copy link
              </MenuItem>
            </Menu>
          </>
        }
        title={user.displayName}
        titleTypographyProps={{ variant: "body1" }}
        subheader={`${createdAtStr}${isEdited ? "- edited" : ""}`}
        subheaderTypographyProps={{ variant: "body2" }}
      />
      <Divider />
      <CardContent>
        {isEditing ? (
          <>
            <TextField
              multiline
              rowsMax={5}
              value={newMessage}
              onChange={event => setNewMessage(event.target.value)}
            />
            <IconButton
              aria-label="reset"
              onClick={() => {
                setNewMessage(message);
                setIsEditing(false);
              }}
            >
              <ClearIcon />
            </IconButton>
            <IconButton
              aria-label="done"
              onClick={() => {
                if (!commentId) return;
                update(
                  commentId,
                  { message: newMessage, isEdited: true },
                  { merge: true },
                );
                setIsEditing(false);
              }}
            >
              <DoneIcon />
            </IconButton>
          </>
        ) : (
          <Typography variant="body2" color="textSecondary" component="p">
            {message}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

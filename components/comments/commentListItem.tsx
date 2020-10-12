import { Divider } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Chip from "@material-ui/core/Chip";
import IconButton from "@material-ui/core/IconButton";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import React, { useState } from "react";
import useUpdateComment from "../../utils/comments/hooks/useUpdateComment";

import { CommentDocument } from "../../utils/comments/types";
import { convertToDate } from "../../utils/firestore/functions";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: 345,
    },
    media: {
      height: 0,
      paddingTop: "56.25%", // 16:9
    },
    expand: {
      transform: "rotate(0deg)",
      marginLeft: "auto",
      transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: "rotate(180deg)",
    },
  }),
);

export interface CommentListItemProps {
  labelingId: string;
  comment: CommentDocument;
}

export default function CommentListItem(
  props: CommentListItemProps,
): JSX.Element {
  const classes = useStyles();
  const { comment, labelingId } = props;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { update } = useUpdateComment(labelingId);

  const {
    createdAt,
    isAction,
    isResolved,
    isThread,
    isEdited,
    snapshot,
  } = comment;

  const createdAtStr = convertToDate(createdAt)?.toLocaleString() ?? "-";

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <ListItem>
      {!isAction ? (
        <Card className={classes.root}>
          <CardHeader
            action={
              <>
                {isThread && (
                  <Chip
                    color={isResolved ? "primary" : "default"}
                    label={isResolved ? "Unresolve" : "Resolve"}
                    onClick={() => {
                      if (!comment.id) return;
                      update(
                        comment.id,
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
                  <MenuItem onClick={handleClose}>Edit</MenuItem>
                  {snapshot && (
                    <MenuItem onClick={handleClose}>Apply snapshot</MenuItem>
                  )}
                </Menu>
              </>
            }
            title={comment.user.displayName}
            titleTypographyProps={{ variant: "body1" }}
            subheader={`${createdAtStr}${isEdited ? "- edited" : ""}`}
            subheaderTypographyProps={{ variant: "body2" }}
          />
          <Divider />
          <CardContent>
            <Typography variant="body2" color="textSecondary" component="p">
              {comment.message}
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <ListItemText
          primary={comment.user.displayName}
          secondary={
            <>
              <Typography variant="body2">{createdAtStr}</Typography>
              <br />
              {comment.message}
            </>
          }
        />
      )}
    </ListItem>
  );
}

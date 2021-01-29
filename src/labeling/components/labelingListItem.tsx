import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import EditIcon from "@material-ui/icons/Edit";
import ViewListIcon from "@material-ui/icons/ViewList";
import { useRouter } from "next/router";
import React from "react";
import { useAuthUserInfo } from "../../auth/hooks";
import { convertToDate } from "../../firestore/functions";
import { ExternalDocument } from "../types/database";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      margin: theme.spacing(2),
      padding: theme.spacing(2),
    },
    grid: {
      marginTop: theme.spacing(1),
    },
  }),
);

export interface LabelingListItemProps {
  id: string;
  document: ExternalDocument;
  onRemoveClick: () => void;
}

export default function LabelingListItem(
  props: LabelingListItemProps,
): JSX.Element {
  const classes = useStyles();

  const { id, document, onRemoveClick } = props;
  const { user, name, filename, schemaId, project, createdAt } = document;
  const { displayName } = user;

  const router = useRouter();
  const { authUser } = useAuthUserInfo();
  const isSameUser = user.id === authUser?.id;

  const createdAtStr = convertToDate(createdAt)?.toLocaleString() ?? "-";

  return (
    <Paper className={classes.paper} elevation={3}>
      <Typography variant="h5">{name}</Typography>
      <Typography variant="subtitle1">{filename}</Typography>
      <Typography variant="subtitle2">{`Author: ${displayName}`}</Typography>
      <Typography variant="subtitle2">{`Created: ${createdAtStr}`}</Typography>
      <Divider />
      <div>
        <Button
          size="small"
          color="inherit"
          startIcon={<EditIcon />}
          onClick={() =>
            router.push("/labeling/[labelingId]", `/labeling/${id}`)
          }
        >
          Edit
        </Button>
        <Button
          size="small"
          color="inherit"
          startIcon={<ViewListIcon />}
          onClick={() =>
            router.push("/labeling/[labelingId]", `/labeling/${id}`)
          }
        >
          Review
        </Button>
        {project && (
          <Button
            size="small"
            color="inherit"
            startIcon={<ViewListIcon />}
            onClick={() =>
              router.push("/projects/[projectId]", `/projects/${project}`)
            }
          >
            Project
          </Button>
        )}
        <Button
          size="small"
          color="inherit"
          startIcon={<ViewListIcon />}
          onClick={() =>
            router.push("/schema/[schemaId]", `/schema/${schemaId}`)
          }
        >
          Schema
        </Button>
        {isSameUser ? (
          <Button
            size="small"
            color="inherit"
            startIcon={<DeleteOutlineIcon />}
            onClick={() => onRemoveClick()}
          >
            Remove
          </Button>
        ) : (
          <></>
        )}
      </div>
    </Paper>
  );
}

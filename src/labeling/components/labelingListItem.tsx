import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import EditIcon from "@material-ui/icons/Edit";
import ViewListIcon from "@material-ui/icons/ViewList";
import { useRouter } from "next/router";
import React from "react";
import useAuth from "../../auth/hooks/useAuth";
import { convertToDate } from "../../firebase/functions";
import { ExternalDocument } from "../../workspace/types/database";
import { useLabelingListItemStyles } from "../styles";

export interface LabelingListItemProps {
  id: string;
  document: ExternalDocument;
  onRemoveClick: () => void;
}

export default function LabelingListItem(
  props: LabelingListItemProps,
): JSX.Element {
  const classes = useLabelingListItemStyles();

  const { id, document, onRemoveClick } = props;
  const { user, name, filename, schemaId, project, createdAt } = document;
  const { displayName } = user;

  const router = useRouter();
  const { authUser } = useAuth();
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

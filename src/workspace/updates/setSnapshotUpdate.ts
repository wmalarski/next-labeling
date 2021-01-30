import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import { CommentSnapshot } from "../../comments/types";
import { Schema } from "../../schema/types";
import { createLabelingObjects } from "../functions";
import { LabelingState } from "../hooks/useLabelingHistory";
import { LabelingDocument } from "../types/client";

export default function setSnapshotUpdate(
  data: LabelingDocument,
  schema: Schema,
  snapshot: CommentSnapshot,
): LabelingState {
  const { currentFrame, objects, selected, toggled } = snapshot;
  return {
    message: "Snapshot loaded",
    icon: AddAPhotoIcon,
    data: {
      ...data,
      currentFrame,
      selected,
      toggled,
      objects: objects ? createLabelingObjects(objects, schema) : data.objects,
    },
  };
}

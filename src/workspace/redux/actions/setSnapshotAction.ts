import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import { PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { CommentSnapshot } from "../../../comments/types";
import { Schema } from "../../../schema/types";
import { createLabelingObjects } from "../../functions";
import { addSnapshot } from "../functions";
import { currentDocumentSelector } from "../selectors";
import { WorkspaceState } from "../state";

export interface SetSnapshotActionPayload {
  schema: Schema;
  snapshot: CommentSnapshot;
}

export default function setSnapshotAction(
  state: WorkspaceState,
  action: PayloadAction<SetSnapshotActionPayload>,
): WorkspaceState {
  const data = currentDocumentSelector.resultFunc(state);
  const { snapshot, schema } = action.payload;

  const { currentFrame, objects, selected, toggled } = snapshot;
  return addSnapshot(state, {
    id: uuidv4(),
    message: "Snapshot loaded",
    icon: AddAPhotoIcon,
    data: {
      ...data,
      currentFrame,
      selected,
      toggled,
      objects: objects ? createLabelingObjects(objects, schema) : data.objects,
    },
  });
}

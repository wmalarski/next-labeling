import { PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { CommentSnapshot } from "../../../comments/types";
import { createLabelingObjects } from "../../../workspace/functions";
import { addSnapshot } from "../../../workspace/redux/functions";
import {
  currentDocumentSelector,
  initialDocumentSelector,
  schemaSelector,
} from "../../../workspace/redux/selectors";
import { WorkspaceState } from "../../../workspace/redux/state";
import { LabelingAction } from "../../../workspace/types/client";

export interface SetSnapshotActionPayload {
  snapshot: CommentSnapshot;
}

export default function setSnapshotAction(
  state: WorkspaceState,
  action: PayloadAction<SetSnapshotActionPayload>,
): WorkspaceState {
  const initial = initialDocumentSelector.resultFunc(state);
  const schema = schemaSelector.resultFunc(initial);
  const data = currentDocumentSelector.resultFunc(state);
  const { snapshot } = action.payload;

  const { currentFrame, objects, selected, toggled } = snapshot;
  return addSnapshot(state, {
    id: uuidv4(),
    message: "Snapshot loaded",
    action: LabelingAction.SET_SNAPSHOT,
    data: {
      ...data,
      currentFrame,
      selected,
      toggled,
      objects: objects ? createLabelingObjects(objects, schema) : data.objects,
    },
  });
}

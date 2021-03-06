import { nanoid } from "@reduxjs/toolkit";
import {
  SnapshotPayloadAction,
  SnapshotPrepareAction,
} from "../../../common/redux/types";
import { copyObject } from "../../../workspace/functions";
import { addSnapshot } from "../../../workspace/redux/functions";
import { currentDocumentSelector } from "../../../workspace/redux/selectors";
import { WorkspaceState } from "../../../workspace/redux/state";
import {
  LabelingAction,
  LabelingObject,
} from "../../../workspace/types/client";

export function reducer(
  state: WorkspaceState,
  action: SnapshotPayloadAction<LabelingObject[]>,
): WorkspaceState {
  const data = currentDocumentSelector.resultFunc(state);
  const { payload: newObjects, meta } = action;

  return addSnapshot(state, {
    id: meta.snapshotId,
    message: "Objects copied",
    action: LabelingAction.ADD_OBJECT_COPY,
    data: {
      ...data,
      objects: [...data.objects, ...newObjects],
    },
  });
}

export function prepare(
  objects: LabelingObject[],
): SnapshotPrepareAction<LabelingObject[]> {
  return {
    payload: objects.map(object => copyObject(object)),
    meta: { snapshotId: nanoid() },
  };
}

export default { reducer, prepare };

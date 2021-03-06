import { nanoid } from "@reduxjs/toolkit";
import compact from "lodash/compact";
import {
  SnapshotPayloadAction,
  SnapshotPrepareAction,
} from "../../../common/redux/types";
import {
  copyObject,
  deleteObjectBackward,
  deleteObjectForward,
} from "../../../workspace/functions";
import { addSnapshot } from "../../../workspace/redux/functions";
import { currentDocumentSelector } from "../../../workspace/redux/selectors";
import { WorkspaceState } from "../../../workspace/redux/state";
import {
  LabelingAction,
  LabelingObject,
} from "../../../workspace/types/client";

export interface AddObjectSplitActionPairs {
  original: LabelingObject;
  copy: LabelingObject;
}

export function reducer(
  state: WorkspaceState,
  action: SnapshotPayloadAction<AddObjectSplitActionPairs[]>,
): WorkspaceState {
  const { payload: pairs, meta } = action;

  const data = currentDocumentSelector.resultFunc(state);

  return addSnapshot(state, {
    id: meta.snapshotId,
    message: "Objects splited",
    action: LabelingAction.ADD_OBJECT,
    data: {
      ...data,
      objects: data.objects.flatMap(object => {
        const pair = pairs.find(iPair => iPair.original.id === object.id);
        if (!pair) return [object];
        return compact([pair.original, pair.copy]);
      }),
    },
  });
}

export interface AddObjectSplitPayload {
  objects: LabelingObject[];
  currentFrame: number;
}

export function prepare(
  payload: AddObjectSplitPayload,
): SnapshotPrepareAction<AddObjectSplitActionPairs[]> {
  const { objects, currentFrame } = payload;

  const pairs: AddObjectSplitActionPairs[] = compact(
    objects.map(object => {
      const original = deleteObjectForward(object, currentFrame);
      const copy = deleteObjectBackward(copyObject(object), currentFrame);
      return !original || !copy ? null : { original, copy };
    }),
  );

  return {
    payload: pairs,
    meta: { snapshotId: nanoid() },
  };
}

export default { reducer, prepare };

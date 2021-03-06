import { nanoid } from "@reduxjs/toolkit";
import {
  SnapshotPayloadAction,
  SnapshotPrepareAction,
} from "../../../common/redux/types";
import { LabelingFieldValues } from "../../../editors/types";
import { createObject } from "../../functions";
import {
  DrawingTool,
  LabelingAction,
  LabelingObject,
} from "../../types/client";
import { addSnapshot } from "../functions";
import { currentDocumentSelector } from "../selectors";
import { WorkspaceState } from "../state";

export function reducer(
  state: WorkspaceState,
  action: SnapshotPayloadAction<LabelingObject>,
): WorkspaceState {
  const { payload: object, meta } = action;

  const data = currentDocumentSelector.resultFunc(state);
  const { objects } = data;

  return addSnapshot(state, {
    id: meta.snapshotId,
    message: `${object.name} created`,
    action: LabelingAction.ADD_OBJECT,
    data: {
      ...data,
      objects: [...objects, object],
      selected: [
        {
          fieldIds: [],
          objectId: object.id,
          objectSelected: true,
          singleton: object.objectSchema.singleton,
        },
      ],
    },
  });
}

export interface AddObjectPayload {
  values: LabelingFieldValues;
  drawingTool: DrawingTool;
  currentFrame: number;
}

export function prepare(
  payload: AddObjectPayload,
): SnapshotPrepareAction<LabelingObject> {
  const { values, currentFrame, drawingTool } = payload;
  const { fieldSchema, objectSchema } = drawingTool;

  const object = createObject({
    objectSchema,
    currentFrame,
    defaultFields: [{ fieldSchemaId: fieldSchema.id, values }],
  });

  return {
    payload: object,
    meta: { snapshotId: nanoid() },
  };
}

export default { reducer, prepare };

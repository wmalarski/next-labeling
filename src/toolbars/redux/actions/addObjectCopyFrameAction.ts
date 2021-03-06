import { nanoid } from "@reduxjs/toolkit";
import compact from "lodash/compact";
import {
  SnapshotPayloadAction,
  SnapshotPrepareAction,
} from "../../../common/redux/types";
import { getFieldValues, unpackValues } from "../../../editors/functions";
import { createObject, CreateObjectFields } from "../../../workspace/functions";
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

  return addSnapshot(state, {
    id: action.meta.snapshotId,
    message: "Objects frame copied",
    action: LabelingAction.ADD_OBJECT_COPY,
    data: {
      ...data,
      objects: [...data.objects, ...action.payload],
    },
  });
}

export interface AddObjectCopyFramePayload {
  objects: LabelingObject[];
  currentFrame: number;
}

export function prepare(
  payload: AddObjectCopyFramePayload,
): SnapshotPrepareAction<LabelingObject[]> {
  const { currentFrame, objects } = payload;

  const newObjects = objects.map(object => {
    const defaultFields: CreateObjectFields[] = compact(
      object.fields.map(field => {
        const currentValue = getFieldValues({
          values: field.values,
          perFrame: field.fieldSchema.perFrame,
          frame: currentFrame,
        });
        const unpacked = currentValue && unpackValues(currentValue);
        if (!unpacked) return null;

        const value = unpacked.pairs[0]?.value;
        if (!value) return null;

        return {
          fieldSchemaId: field.fieldSchemaId,
          values: { [unpacked.type]: [{ frame: currentFrame, value }] },
        };
      }),
    );

    return createObject({
      objectSchema: object.objectSchema,
      currentFrame,
      defaultFields,
    });
  });

  return {
    payload: newObjects,
    meta: { snapshotId: nanoid() },
  };
}

export default { reducer, prepare };

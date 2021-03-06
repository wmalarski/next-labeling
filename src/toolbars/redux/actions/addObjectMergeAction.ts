import { nanoid } from "@reduxjs/toolkit";
import compact from "lodash/compact";
import {
  SnapshotPayloadAction,
  SnapshotPrepareAction,
} from "../../../common/redux/types";
import {
  UnpackedFrameValuePair,
  UnpackedFrameValues,
  unpackValues,
} from "../../../editors/functions";
import { FieldSchema } from "../../../schema/types";
import { createObject, CreateObjectFields } from "../../../workspace/functions";
import { addSnapshot } from "../../../workspace/redux/functions";
import { currentDocumentSelector } from "../../../workspace/redux/selectors";
import { WorkspaceState } from "../../../workspace/redux/state";
import {
  LabelingAction,
  LabelingObject,
} from "../../../workspace/types/client";

type FieldReducer = Record<
  string,
  {
    values: UnpackedFrameValues;
    fieldSchema: FieldSchema;
  }
>;

export interface AddObjectMergeReducerPayload {
  newObject: LabelingObject | null;
  oldObjects: LabelingObject[];
}

export function reducer(
  state: WorkspaceState,
  action: SnapshotPayloadAction<AddObjectMergeReducerPayload>,
): WorkspaceState {
  const data = currentDocumentSelector.resultFunc(state);

  const { payload, meta } = action;
  const { newObject, oldObjects } = payload;

  if (!newObject) return state;

  const ids = oldObjects.map(object => object.id);

  return addSnapshot(state, {
    id: meta.snapshotId,
    message: "Objects merged",
    action: LabelingAction.ADD_OBJECT,
    data: {
      ...data,
      objects: [
        ...data.objects.filter(object => !ids.includes(object.id)),
        newObject,
      ],
    },
  });
}

export interface AddObjectMergePayload {
  objectsToMerge: LabelingObject[];
  currentFrame: number;
}

export function prepare(
  payload: AddObjectMergePayload,
): SnapshotPrepareAction<AddObjectMergeReducerPayload> {
  const { objectsToMerge, currentFrame } = payload;

  const uniqueSchemaId = new Set(
    objectsToMerge.map(object => object.objectSchemaId),
  );
  if (uniqueSchemaId.size > 1 || objectsToMerge.length < 2)
    return {
      payload: {
        newObject: null,
        oldObjects: [],
      },
      meta: {
        snapshotId: nanoid(),
      },
    };

  const frames = compact(
    Array.from(new Set(objectsToMerge.flatMap(object => object.frames))),
  );

  const fieldsValues = Object.entries(
    objectsToMerge.reduce<FieldReducer>((prevObject, object) => {
      return object.fields.reduce<FieldReducer>((prevField, field) => {
        const { values, fieldSchema, fieldSchemaId } = field;
        const unpacked = unpackValues(values);
        if (!unpacked) return prevField;
        const prevPairs = prevField[fieldSchemaId]?.values.pairs ?? [];
        return {
          ...prevField,
          [fieldSchemaId]: {
            fieldSchema,
            values: {
              type: unpacked.type,
              pairs: [...prevPairs, ...unpacked.pairs],
            },
          },
        };
      }, prevObject);
    }, {}),
  );

  const defaultFields: CreateObjectFields[] = fieldsValues.map(
    ([fieldSchemaId, value]) => ({
      fieldSchemaId,
      values: {
        [value.values.type]: value.values.pairs
          .sort((a, b) => a.frame - b.frame)
          .reduce<UnpackedFrameValuePair[]>((prev, curr) => {
            if (prev.length === 0) return [curr];
            return JSON.stringify(prev[prev.length - 1].value) ===
              JSON.stringify(curr.value)
              ? prev
              : [...prev, curr];
          }, [])
          .filter(
            (pair, index, array) =>
              array.findIndex(p => p.frame === pair.frame) === index,
          ),
      },
    }),
  );

  const newObject = {
    ...createObject({
      objectSchema: objectsToMerge[0].objectSchema,
      currentFrame,
      defaultFields,
    }),
    frames,
  };

  return {
    payload: {
      newObject,
      oldObjects: objectsToMerge,
    },
    meta: { snapshotId: nanoid() },
  };
}

export default { reducer: reducer, prepare };

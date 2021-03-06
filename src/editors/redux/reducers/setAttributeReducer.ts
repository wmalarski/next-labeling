import { snapshotPrepare } from "../../../common/redux/functions";
import { SnapshotPayloadAction } from "../../../common/redux/types";
import { addSnapshot } from "../../../workspace/redux/functions";
import { currentDocumentSelector } from "../../../workspace/redux/selectors";
import { WorkspaceState } from "../../../workspace/redux/state";
import { LabelingAction } from "../../../workspace/types/client";
import { calculateNewValues } from "../../functions";
import { LabelingFieldValues } from "../../types";

export interface SetAttributePayload {
  objectId: string;
  fieldId: string;
  values: LabelingFieldValues;
}

export function reducer(
  state: WorkspaceState,
  action: SnapshotPayloadAction<SetAttributePayload>,
): WorkspaceState {
  const { payload, meta } = action;
  const { fieldId, objectId, values } = payload;

  const data = currentDocumentSelector.resultFunc(state);

  const objectIndex = data.objects.findIndex(obj => obj.id === objectId);
  const objects = [...data.objects];
  const object = objects[objectIndex];
  const fieldIndex = object.fields.findIndex(f => f.id === fieldId);
  const fields = [...object.fields];
  const field = fields[fieldIndex];

  const newValues = calculateNewValues(
    field.values,
    field.fieldSchema.perFrame,
    values,
    state.preferences.labelingDirection,
  );

  fields[fieldIndex] = { ...field, values: newValues };
  objects[objectIndex] = { ...object, fields };
  return addSnapshot(state, {
    id: meta.snapshotId,
    message: `Attribute ${field.fieldSchema.name} changed`,
    action: LabelingAction.SET_ATTRIBUTE,
    data: { ...data, objects },
  });
}

export default {
  reducer,
  prepare: (payload: SetAttributePayload) => snapshotPrepare(payload),
};

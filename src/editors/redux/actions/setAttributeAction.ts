import EditIcon from "@material-ui/icons/Edit";
import { PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { addSnapshot } from "../../../workspace/redux/functions";
import { currentDocumentSelector } from "../../../workspace/redux/selectors";
import { WorkspaceState } from "../../../workspace/redux/state";
import { calculateNewValues } from "../../functions";
import { LabelingFieldValues } from "../../types";

export interface SetAttributeActionPayload {
  objectId: string;
  fieldId: string;
  values: LabelingFieldValues;
}

export default function setAttributeAction(
  state: WorkspaceState,
  action: PayloadAction<SetAttributeActionPayload>,
): WorkspaceState {
  const data = currentDocumentSelector.resultFunc(state);
  const { fieldId, objectId, values } = action.payload;

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
    id: uuidv4(),
    message: `Attribute ${field.fieldSchema.name} changed`,
    icon: EditIcon,
    data: { ...data, objects },
  });
}

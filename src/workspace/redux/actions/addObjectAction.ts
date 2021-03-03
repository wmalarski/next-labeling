import { PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { drawingToolSelector } from "../../../editors/redux/selectors";
import { LabelingFieldValues } from "../../../editors/types";
import { createObject } from "../../functions";
import { LabelingAction } from "../../types/client";
import { addSnapshot } from "../functions";
import { currentDocumentSelector } from "../selectors";
import { WorkspaceState } from "../state";

export interface AddObjectUpdatePayload {
  values: LabelingFieldValues;
}

export default function addObjectAction(
  state: WorkspaceState,
  action: PayloadAction<AddObjectUpdatePayload>,
): WorkspaceState {
  const data = currentDocumentSelector.resultFunc(state);
  const drawingTool = drawingToolSelector.resultFunc(state);
  if (!drawingTool) return state;

  const { currentFrame, objects } = data;
  const { fieldSchema, objectSchema } = drawingTool;
  const { values } = action.payload;

  if (!objectSchema) return state;

  const object = createObject({
    objectSchema,
    currentFrame,
    defaultFields: [{ fieldId: fieldSchema.id, values }],
  });
  return addSnapshot(state, {
    id: uuidv4(),
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
          singleton: objectSchema.singleton,
        },
      ],
    },
  });
}

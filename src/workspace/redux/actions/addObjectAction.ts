import AddBoxIcon from "@material-ui/icons/AddBox";
import { PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { LabelingFieldValues } from "../../../editors/types";
import { createObject } from "../../functions";
import { addSnapshot } from "../functions";
import {
  drawingToolIdSelector,
  drawingToolSelector,
  initialDocumentSelector,
  schemaSelector,
} from "../selectors/common-selectors";
import { currentDocumentSelector } from "../selectors/doc-selectors";
import { WorkspaceState } from "../state";

export interface AddObjectUpdatePayload {
  values: LabelingFieldValues;
}

export default function addObjectAction(
  state: WorkspaceState,
  action: PayloadAction<AddObjectUpdatePayload>,
): WorkspaceState {
  const data = currentDocumentSelector.resultFunc(state);
  const initial = initialDocumentSelector.resultFunc(state);
  const schema = schemaSelector.resultFunc(initial);
  const drawingToolId = drawingToolIdSelector.resultFunc(state);
  const drawingTool = drawingToolSelector.resultFunc(schema, drawingToolId);
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
    icon: AddBoxIcon,
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

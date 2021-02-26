import AddBoxIcon from "@material-ui/icons/AddBox";
import { PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { createObject, CreateObjectFields } from "../../functions";
import { addSnapshot } from "../functions";
import { currentDocumentSelector } from "../selectors";
import { WorkspaceState } from "../state";

export interface AddObjectUpdatePayload {
  objectSchemaId: string;
  defaultFields: CreateObjectFields[];
}

export default function addObjectAction(
  state: WorkspaceState,
  action: PayloadAction<AddObjectUpdatePayload>,
): WorkspaceState {
  const data = currentDocumentSelector.resultFunc(state);
  const { currentFrame, objects } = data;
  const { objectSchemaId, defaultFields } = action.payload;

  const objectSchema = state.initial.schema.objects.find(
    schema => schema.id === objectSchemaId,
  );

  if (!objectSchema) return state;

  const object = createObject({
    objectSchema,
    currentFrame,
    defaultFields,
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

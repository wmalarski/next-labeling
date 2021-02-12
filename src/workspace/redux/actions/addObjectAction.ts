import AddBoxIcon from "@material-ui/icons/AddBox";
import { PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { ObjectSchema } from "../../../schema/types";
import { createObject } from "../../functions";
import { addSnapshot } from "../functions";
import { currentDocumentSelector } from "../selectors";
import { WorkspaceState } from "../state";

export interface AddObjectUpdatePayload {
  objectSchema: ObjectSchema;
  currentFrame: number;
}

export default function addObjectAction(
  state: WorkspaceState,
  action: PayloadAction<AddObjectUpdatePayload>,
): WorkspaceState {
  const data = currentDocumentSelector.resultFunc(state);
  const { objectSchema, currentFrame } = action.payload;

  const object = createObject(objectSchema, currentFrame);
  return addSnapshot(state, {
    id: uuidv4(),
    message: `${object.name} created`,
    icon: AddBoxIcon,
    data: {
      ...data,
      objects: [...data.objects, object],
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

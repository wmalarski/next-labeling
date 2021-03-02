import { v4 as uuidv4 } from "uuid";
import { LabelingAction } from "../../types/client";
import { addSnapshot } from "../functions";
import { currentDocumentSelector } from "../selectors";
import { WorkspaceState } from "../state";

export default function setSelectedAllAction(
  state: WorkspaceState,
): WorkspaceState {
  const data = currentDocumentSelector.resultFunc(state);

  return addSnapshot(state, {
    id: uuidv4(),
    message: "Selection changed",
    action: LabelingAction.SELECTION_CHANGE,
    data: {
      ...data,
      selected: data.objects.map(object => ({
        fieldIds: object.fields.map(field => field.id),
        objectId: object.id,
        objectSelected: true,
        singleton: object.objectSchema.singleton,
      })),
    },
  });
}

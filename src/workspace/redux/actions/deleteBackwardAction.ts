import compact from "lodash/compact";
import { v4 as uuidv4 } from "uuid";
import { deleteObjectBackward } from "../../functions";
import { LabelingAction } from "../../types/client";
import { addSnapshot } from "../functions";
import { currentDocumentSelector } from "../selectors";
import { WorkspaceState } from "../state";

export default function deleteBackwardAction(
  state: WorkspaceState,
): WorkspaceState {
  const data = currentDocumentSelector.resultFunc(state);

  const currentFrame = data.currentFrame;
  const ids = data.selected
    .filter(object => object.objectSelected)
    .map(object => object.objectId);

  return addSnapshot(state, {
    id: uuidv4(),
    message: "Objects deleted forward",
    action: LabelingAction.DELETE_BACKWARD,
    data: {
      ...data,
      objects: compact(
        data.objects.map(object =>
          !ids.includes(object.id)
            ? object
            : deleteObjectBackward(object, currentFrame),
        ),
      ),
    },
  });
}

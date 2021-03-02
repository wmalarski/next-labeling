import compact from "lodash/compact";
import { v4 as uuidv4 } from "uuid";
import {
  copyObject,
  deleteObjectBackward,
  deleteObjectForward,
} from "../../../workspace/functions";
import { addSnapshot } from "../../../workspace/redux/functions";
import { currentDocumentSelector } from "../../../workspace/redux/selectors";
import { WorkspaceState } from "../../../workspace/redux/state";
import { LabelingAction } from "../../../workspace/types/client";

export default function addObjectSplitAction(
  state: WorkspaceState,
): WorkspaceState {
  const data = currentDocumentSelector.resultFunc(state);
  const { currentFrame } = data;

  const ids = data.selected
    .filter(object => object.objectSelected)
    .map(object => object.objectId);

  return addSnapshot(state, {
    id: uuidv4(),
    message: "Objects splited",
    action: LabelingAction.ADD_OBJECT,
    data: {
      ...data,
      objects: data.objects.flatMap(object => {
        if (!ids.includes(object.id)) return [object];
        return compact([
          deleteObjectForward(object, currentFrame),
          deleteObjectBackward(copyObject(object), currentFrame),
        ]);
      }),
    },
  });
}

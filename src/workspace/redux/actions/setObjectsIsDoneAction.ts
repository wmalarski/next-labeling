import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { v4 as uuidv4 } from "uuid";
import { addSnapshot } from "../functions";
import { currentDocumentSelector } from "../selectors";
import { WorkspaceState } from "../state";

export default function setObjectsIsDoneAction(
  state: WorkspaceState,
): WorkspaceState {
  const data = currentDocumentSelector.resultFunc(state);

  const objects = data.selected.filter(object => object.objectSelected);
  const firstId = objects[0]?.objectId;
  const firstObject = data.objects.find(object => object.id === firstId);
  const firstIsDone = firstObject?.isDone;

  const ids = objects.map(object => object.objectId);
  return addSnapshot(state, {
    id: uuidv4(),
    message: "Objects Done toggled",
    icon: CheckCircleIcon,
    data: {
      ...data,
      objects: data.objects.map(object =>
        !ids.includes(object.id)
          ? object
          : {
              ...object,
              isDone: !firstIsDone,
            },
      ),
    },
  });
}

import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import { v4 as uuidv4 } from "uuid";
import { addSnapshot } from "../functions";
import { currentDocumentSelector } from "../selectors";
import { WorkspaceState } from "../state";

export default function deleteObjectsAction(
  state: WorkspaceState,
): WorkspaceState {
  const data = currentDocumentSelector.resultFunc(state);

  const ids = data.selected
    .filter(object => object.objectSelected)
    .map(object => object.objectId);
  return addSnapshot(state, {
    id: uuidv4(),
    message: "Objects removed",
    icon: HighlightOffIcon,
    data: {
      ...data,
      objects: data.objects.filter(object => !ids.includes(object.id)),
    },
  });
}

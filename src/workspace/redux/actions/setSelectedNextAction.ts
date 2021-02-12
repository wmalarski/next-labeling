import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import { PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { addSnapshot } from "../functions";
import { currentDocumentSelector } from "../selectors";
import { WorkspaceState } from "../state";

export default function setSelectedNextAction(
  state: WorkspaceState,
  action: PayloadAction<number>,
): WorkspaceState {
  const data = currentDocumentSelector.resultFunc(state);
  const { payload: change } = action;

  const { currentFrame, objects, selected } = data;

  const selectedIds = selected
    .filter(object => object.objectSelected)
    .map(object => object.objectId);

  const objectsInFrame = objects.filter(object =>
    object.frames?.includes(currentFrame),
  );
  const firstSelectedIndex = objectsInFrame.findIndex(object =>
    selectedIds.includes(object.id),
  );

  const nextSelectedIndex =
    firstSelectedIndex === -1
      ? 0
      : (firstSelectedIndex + change + objectsInFrame.length) %
        objectsInFrame.length;

  const firstObject = objectsInFrame[nextSelectedIndex];
  return addSnapshot(state, {
    id: uuidv4(),
    message: "Selection changed",
    icon: NavigateNextIcon,
    data: {
      ...data,
      selected: firstObject
        ? [
            {
              fieldIds: firstObject.fields.map(field => field.id),
              singleton: firstObject.objectSchema.singleton,
              objectId: firstObject.id,
              objectSelected: true,
            },
          ]
        : [],
    },
  });
}

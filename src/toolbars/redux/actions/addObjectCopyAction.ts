import FileCopyIcon from "@material-ui/icons/FileCopy";
import { PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { copyObject } from "../../../workspace/functions";
import { addSnapshot } from "../../../workspace/redux/functions";
import { currentDocumentSelector } from "../../../workspace/redux/selectors";
import { WorkspaceState } from "../../../workspace/redux/state";

export default function addObjectCopyAction(
  state: WorkspaceState,
  action: PayloadAction<string[]>,
): WorkspaceState {
  const data = currentDocumentSelector.resultFunc(state);
  const { payload: ids } = action;

  return addSnapshot(state, {
    id: uuidv4(),
    message: "Objects copied",
    icon: FileCopyIcon,
    data: {
      ...data,
      objects: [
        ...data.objects,
        ...data.objects
          .filter(object => ids.includes(object.id))
          .map(object => copyObject(object)),
      ],
    },
  });
}

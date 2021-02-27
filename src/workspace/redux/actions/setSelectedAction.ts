import SelectAllIcon from "@material-ui/icons/SelectAll";
import { PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { getFrames } from "../../functions";
import { ObjectSelection } from "../../types/client";
import { addSnapshot } from "../functions";
import { currentDocumentSelector } from "../selectors/doc-selectors";
import { WorkspaceState } from "../state";

export default function setSelectedAction(
  state: WorkspaceState,
  action: PayloadAction<ObjectSelection[]>,
): WorkspaceState {
  const data = currentDocumentSelector.resultFunc(state);
  const { payload: selected } = action;

  const { currentFrame } = data;
  const ids = data.selected.map(selection => selection.objectId);
  const newIds = selected
    .filter(selection => !ids.includes(selection.objectId))
    .map(selection => selection.objectId);

  const frames = getFrames(data, newIds);
  const newFrame =
    frames.length === 0 || frames.includes(currentFrame)
      ? currentFrame
      : Math.min(...frames);

  return addSnapshot(state, {
    id: uuidv4(),
    message: "Selection changed",
    icon: SelectAllIcon,
    data: { ...data, selected, currentFrame: newFrame },
  });
}

import { PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { createLabelingDocument } from "../../functions";
import { ExternalDocument } from "../../types/database";
import { WorkspaceState } from "../state";

export default function resetLabelingAction(
  state: WorkspaceState,
  action: PayloadAction<ExternalDocument>,
): WorkspaceState {
  const { payload: initial } = action;
  const data = createLabelingDocument(initial);

  return {
    history: [{ id: uuidv4(), data, message: "LabelingLoaded" }],
    index: 0,
    initial,
  };
}

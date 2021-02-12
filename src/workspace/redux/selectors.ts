import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../common/redux/store";
import { LabelingDocument } from "../types/client";
import { WorkspaceSnapshotMessage, WorkspaceState } from "./state";

export const workspaceSelector = (state: RootState): WorkspaceState =>
  state.workspace;

export const currentDocumentSelector = createSelector(
  workspaceSelector,
  (state): LabelingDocument => state.history[state.index].data,
);

export const messagesSelector = createSelector(
  workspaceSelector,
  (state): WorkspaceSnapshotMessage[] =>
    state.history.map(pair => ({
      message: pair.message,
      id: pair.id,
      icon: pair.icon,
    })),
);

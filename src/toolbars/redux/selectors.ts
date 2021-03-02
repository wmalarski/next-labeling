import { createSelector } from "@reduxjs/toolkit";
import { workspaceSelector } from "../../workspace/redux/selectors";
import {
  WorkspaceSnapshot,
  WorkspaceSnapshotMessage,
} from "../../workspace/redux/state";

export const messagesSelector = createSelector(
  workspaceSelector,
  (state): WorkspaceSnapshotMessage[] =>
    state.history.map(pair => ({
      message: pair.message,
      id: pair.id,
      action: pair.action,
    })),
);

export const currentSnapshotSelector = createSelector(
  workspaceSelector,
  (state): WorkspaceSnapshot => state.history[state.index],
);

export const undoMessageSelector = createSelector(
  currentSnapshotSelector,
  (state): string => state.message,
);

export const redoMessageSelector = createSelector(
  currentSnapshotSelector,
  (state): string => state.message,
);

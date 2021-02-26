import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../common/redux/store";
import { Schema } from "../../schema/types";
import { LabelingDisplayFilters, LabelingDocument } from "../types/client";
import { ExternalDocument } from "../types/database";
import {
  WorkspaceSnapshot,
  WorkspaceSnapshotMessage,
  WorkspaceState,
} from "./state";

export const workspaceSelector = (state: RootState): WorkspaceState =>
  state.workspace;

export const currentSnapshotSelector = createSelector(
  workspaceSelector,
  (state): WorkspaceSnapshot => state.history[state.index],
);

export const currentDocumentSelector = createSelector(
  workspaceSelector,
  (state): LabelingDocument => state.history[state.index].data,
);

export const currentFrameSelector = createSelector(
  currentDocumentSelector,
  (state): number => state.currentFrame,
);

export const initialDocumentSelector = createSelector(
  workspaceSelector,
  (state): ExternalDocument => state.initial,
);

export const schemaSelector = createSelector(
  initialDocumentSelector,
  (state): Schema => state.schema,
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

export const undoMessageSelector = createSelector(
  workspaceSelector,
  (state): string => state.history[state.index - 1]?.message,
);

export const redoMessageSelector = createSelector(
  workspaceSelector,
  (state): string => state.history[state.index + 1]?.message,
);

export const durationSelector = createSelector(
  workspaceSelector,
  (state): number => state.duration,
);

export const filtersSelector = createSelector(
  workspaceSelector,
  (state): LabelingDisplayFilters => state.filters,
);

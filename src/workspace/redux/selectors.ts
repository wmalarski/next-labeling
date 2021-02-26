import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../common/redux/store";
import { Schema } from "../../schema/types";
import { ShortcutActions } from "../shortcuts";
import {
  LabelingDisplayFilters,
  LabelingDocument,
  ToolType,
} from "../types/client";
import { ExternalDocument } from "../types/database";
import { LabelingViews } from "../views";
import {
  LabelingDirection,
  PreferencesState,
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

export const drawingToolSelector = createSelector(
  workspaceSelector,
  (state): string | null => state.drawingTool,
);

export const toolTypeSelector = createSelector(
  workspaceSelector,
  (state): ToolType => state.toolType,
);

export const preferencesSelector = createSelector(
  workspaceSelector,
  (state): PreferencesState => state.preferences,
);

export const labelingDirectionSelector = createSelector(
  preferencesSelector,
  (state): LabelingDirection => state.labelingDirection,
);

export const frameStepSelector = createSelector(
  preferencesSelector,
  (state): number => state.frameChangeStep,
);

export const shortcutsSelector = createSelector(
  preferencesSelector,
  (state): ShortcutActions => state.shortcuts,
);

export const autoSaveDelayMinutesSelector = createSelector(
  preferencesSelector,
  (state): number | null => state.autoSaveDelayMinutes,
);

export const labelingViewsSelector = createSelector(
  preferencesSelector,
  (state): LabelingViews => state.views,
);

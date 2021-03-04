import { createSelector } from "@reduxjs/toolkit";
import { workspaceSelector } from "../../workspace/redux/selectors";
import {
  LabelingDirection,
  PreferencesState,
} from "../../workspace/redux/state";
import { ShortcutActions } from "../../workspace/shortcuts";
import { LabelingViews } from "../../workspace/views";

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

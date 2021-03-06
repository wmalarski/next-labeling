import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../common/redux/store";
import { Schema } from "../../schema/types";
import {
  LabelingDisplayFilters,
  LabelingDocument,
  LabelingObject,
  ObjectSelection,
} from "../types/client";
import { ExternalDocument } from "../types/database";
import { WorkspaceState } from "./state";

export const workspaceSelector = (state: RootState): WorkspaceState =>
  state.workspace;

export const filtersSelector = createSelector(
  workspaceSelector,
  (state): LabelingDisplayFilters => state.filters,
);

export const initialDocumentSelector = createSelector(
  workspaceSelector,
  (state): ExternalDocument => state.initial,
);

export const schemaSelector = createSelector(
  initialDocumentSelector,
  (state): Schema => state.schema,
);

export const durationSelector = createSelector(
  workspaceSelector,
  (state): number => state.duration,
);

export const currentDocumentSelector = createSelector(
  workspaceSelector,
  (state): LabelingDocument => state.history[state.index].data,
);

export const currentFrameSelector = createSelector(
  currentDocumentSelector,
  (state): number => state.currentFrame,
);

export const objectsSelector = createSelector(
  currentDocumentSelector,
  (doc): LabelingObject[] => doc.objects,
);

export const selectedObjectSelector = createSelector(
  currentDocumentSelector,
  (state): ObjectSelection[] => state.selected,
);

export const toggledObjectSelector = createSelector(
  currentDocumentSelector,
  (state): string[] => state.toggled,
);

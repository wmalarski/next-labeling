import { createSelector } from "@reduxjs/toolkit";
import {
  FilterFieldsResultPair,
  filterSelectedFields,
  inFrameFilter,
  labelingFilter,
} from "../../functions";
import {
  LabelingDocument,
  LabelingObject,
  ObjectSelection,
} from "../../types/client";
import { WorkspaceSnapshot } from "../state";
import { filtersSelector, workspaceSelector } from "./common-selectors";

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

export const filteredObjectSelector = createSelector(
  filtersSelector,
  objectsSelector,
  (filters, objects): LabelingObject[] =>
    objects.filter(labelingFilter(filters)),
);

export const filteredInFrameObjectSelector = createSelector(
  filteredObjectSelector,
  currentFrameSelector,
  (filteredObjects, currentFrame): LabelingObject[] =>
    filteredObjects.filter(inFrameFilter(currentFrame)),
);

export const selectedFieldsSelector = createSelector(
  currentDocumentSelector,
  (state): FilterFieldsResultPair[] => filterSelectedFields(state),
);

export const selectedObjectSelector = createSelector(
  currentDocumentSelector,
  (state): ObjectSelection[] => state.selected,
);

export const toggledObjectSelector = createSelector(
  currentDocumentSelector,
  (state): string[] => state.toggled,
);

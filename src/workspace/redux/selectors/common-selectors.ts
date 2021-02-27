import { createSelector } from "@reduxjs/toolkit";
import compact from "lodash/compact";
import head from "lodash/head";
import { RootState } from "../../../common/redux/store";
import { Schema } from "../../../schema/types";
import {
  DrawingTool,
  LabelingDisplayFilters,
  ToolType,
} from "../../types/client";
import { ExternalDocument } from "../../types/database";
import { WorkspaceSnapshotMessage, WorkspaceState } from "../state";

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

export const messagesSelector = createSelector(
  workspaceSelector,
  (state): WorkspaceSnapshotMessage[] =>
    state.history.map(pair => ({
      message: pair.message,
      id: pair.id,
      icon: pair.icon,
    })),
);

export const durationSelector = createSelector(
  workspaceSelector,
  (state): number => state.duration,
);

export const toolTypeSelector = createSelector(
  workspaceSelector,
  (state): ToolType => state.toolType,
);

export const drawingToolIdSelector = createSelector(
  workspaceSelector,
  (state): string | null => state.drawingTool,
);

export const drawingToolSelector = createSelector(
  schemaSelector,
  drawingToolIdSelector,
  (schema, drawingToolId): DrawingTool | null =>
    head(
      compact(
        schema.objects.map(objectSchema => {
          const field = objectSchema.fields.find(
            fieldSchema => fieldSchema.id === drawingToolId,
          );
          return field ? { objectSchema, fieldSchema: field } : null;
        }),
      ),
    ) ?? null,
);

import { createSelector } from "@reduxjs/toolkit";
import compact from "lodash/compact";
import head from "lodash/head";
import {
  schemaSelector,
  workspaceSelector,
} from "../../workspace/redux/selectors";
import { DrawingTool, ToolType } from "../../workspace/types/client";

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

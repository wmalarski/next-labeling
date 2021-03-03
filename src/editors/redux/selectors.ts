import { createSelector } from "@reduxjs/toolkit";
import { workspaceSelector } from "../../workspace/redux/selectors";
import { DrawingTool, ToolType } from "../../workspace/types/client";

export const toolTypeSelector = createSelector(
  workspaceSelector,
  (state): ToolType => state.toolType,
);

export const drawingToolSelector = createSelector(
  workspaceSelector,
  (state): DrawingTool | null => state.drawingTool,
);

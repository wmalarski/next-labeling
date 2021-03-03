import { ShortcutActions } from "../shortcuts";
import {
  DrawingTool,
  LabelingAction,
  LabelingDisplayFilters,
  LabelingDocument,
  ToolType,
} from "../types/client";
import { ExternalDocument } from "../types/database";
import { LabelingViews } from "../views";

export const HISTORY_LIMIT = 10;

export enum LabelingDirection {
  FORWARD = "FORWARD",
  BACKWARD = "BACKWARD",
}

export interface PreferencesState {
  labelingDirection: LabelingDirection;
  frameChangeStep: number;
  shortcuts: ShortcutActions;
  autoSaveDelayMinutes: number | null;
  views: LabelingViews;
}

export interface WorkspaceSnapshot {
  id: string;
  data: LabelingDocument;
  message: string;
  action?: LabelingAction;
}

export interface WorkspaceSnapshotMessage {
  id: string;
  message: string;
  action?: LabelingAction;
}

export interface WorkspaceState {
  initial: ExternalDocument;
  history: WorkspaceSnapshot[];
  index: number;
  duration: number;
  filters: LabelingDisplayFilters;
  toolType: ToolType;
  drawingTool: DrawingTool | null;
  preferences: PreferencesState;
}

import { OverridableComponent } from "@material-ui/core/OverridableComponent";
import { SvgIconTypeMap } from "@material-ui/core/SvgIcon";
import { ShortcutActions } from "../shortcuts";
import {
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
  icon?: OverridableComponent<SvgIconTypeMap<unknown, "svg">>;
}

export interface WorkspaceSnapshotMessage {
  id: string;
  message: string;
  icon?: OverridableComponent<SvgIconTypeMap<unknown, "svg">>;
}

export interface WorkspaceState {
  initial: ExternalDocument;
  history: WorkspaceSnapshot[];
  index: number;
  duration: number;
  filters: LabelingDisplayFilters;
  toolType: ToolType;
  drawingTool: string | null;
  preferences: PreferencesState;
}

import { OverridableComponent } from "@material-ui/core/OverridableComponent";
import { SvgIconTypeMap } from "@material-ui/core/SvgIcon";
import { LabelingDisplayFilters, LabelingDocument } from "../types/client";
import { ExternalDocument } from "../types/database";

export const HISTORY_LIMIT = 10;

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
}

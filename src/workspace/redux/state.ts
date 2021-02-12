import { OverridableComponent } from "@material-ui/core/OverridableComponent";
import { SvgIconTypeMap } from "@material-ui/core/SvgIcon";
import { LabelingDocument } from "../types/client";

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
  history: WorkspaceSnapshot[];
  index: number;
}

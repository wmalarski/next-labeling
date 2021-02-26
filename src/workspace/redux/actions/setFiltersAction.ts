import { PayloadAction } from "@reduxjs/toolkit";
import { LabelingDisplayFilters } from "../../types/client";
import { WorkspaceState } from "../state";

export default function setFiltersAction(
  state: WorkspaceState,
  action: PayloadAction<LabelingDisplayFilters>,
): WorkspaceState {
  const { payload } = action;
  return { ...state, filters: payload };
}

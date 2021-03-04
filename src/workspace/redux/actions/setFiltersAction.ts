import { PayloadAction } from "@reduxjs/toolkit";
import { LabelingDisplayFilters } from "../../types/client";
import { WorkspaceState } from "../state";

export default function setFiltersAction(
  state: WorkspaceState,
  action: PayloadAction<Partial<LabelingDisplayFilters>>,
): WorkspaceState {
  const { payload } = action;
  return { ...state, filters: { ...state.filters, ...payload } };
}

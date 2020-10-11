export const SchemaCollection = "spaces";
export const LabelingCollection = "labeling";

export interface ResultSnackbarState {
  isOpen: boolean;
  message?: string;
}

export interface DocumentWithId {
  id?: string;
}

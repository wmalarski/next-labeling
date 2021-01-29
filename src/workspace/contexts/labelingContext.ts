import { createContext } from "react";
import { UseLabelingHistoryResult } from "../hooks/useLabelingHistory";
import { IsDoneFilterValue, LabelingDisplayFilters } from "../types/client";
import { ExternalDocument } from "../types/database";

export interface LabelingContextValue {
  saveLabeling: (doc: ExternalDocument) => void;
  removeLabeling: (doc: ExternalDocument) => void;
  setDuration: (duration: number) => void;
  setFilters: (filters: LabelingDisplayFilters) => void;
  duration: number;
  document: ExternalDocument;
  history: UseLabelingHistoryResult;
  filters: LabelingDisplayFilters;
}

const LabelingContext = createContext<LabelingContextValue>({
  saveLabeling: () => void 0,
  removeLabeling: () => void 0,
  setDuration: () => void 0,
  setFilters: () => void 0,
  filters: {
    objectSchemaIds: [],
    isDone: IsDoneFilterValue.ALL,
  },
  duration: 1,
  history: {
    message: "",
    redoLabeling: () => void 0,
    undoLabeling: () => void 0,
    pushLabeling: () => void 0,
    setLabelingId: () => void 0,
    messages: [],
    currentId: "",
    data: {
      objects: [],
      currentFrame: 0,
      selected: [],
      toggled: [],
    },
  },
  document: {
    project: null,
    createdAt: null,
    objects: [],
    filename: "",
    fps: 24,
    name: "",
    schemaId: "",
    schema: {
      description: "",
      name: "",
      objects: [],
      version: "",
    },
    user: {
      displayName: "",
      email: "",
      emailVerified: false,
      id: "",
    },
  },
});

export default LabelingContext;

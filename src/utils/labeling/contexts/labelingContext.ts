import { createContext } from "react";

import { ExternalDocument } from "../types/database";
import { UseLabelingHistoryResult } from "../hooks/useLabelingHistory";

export interface LabelingContextValue {
  saveLabeling: (doc: ExternalDocument) => void;
  removeLabeling: (doc: ExternalDocument) => void;
  setDuration: (duration: number) => void;
  duration: number;
  document: ExternalDocument;
  history: UseLabelingHistoryResult;
}

const LabelingContext = createContext<LabelingContextValue>({
  saveLabeling: () => void 0,
  removeLabeling: () => void 0,
  setDuration: () => void 0,
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
    contributors: [],
    created: "",
    objects: [],
    filename: "",
    fps: 24,
    id: "",
    name: "",
    public: false,
    schemaId: "",
    schema: {
      description: "",
      name: "",
      objects: [],
      version: "",
    },
    stars: 0,
    user: {
      displayName: "",
      email: "",
      emailVerified: false,
      id: "",
    },
    projects: [],
    edited: [],
  },
});

export default LabelingContext;

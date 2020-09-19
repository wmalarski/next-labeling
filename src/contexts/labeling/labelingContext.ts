import { createContext } from "react";
import { LabelingDocument } from "../../utils/labeling/types";
import { UseLabelingHistoryResult } from "../../utils/labeling/useLabelingHistory";
import { FieldSchema, ObjectSchema } from "../../utils/schema/types";

export interface LabelingContextValue {
  pushLabeling: (doc: LabelingDocument) => void;
  removeLabeling: (doc: LabelingDocument) => void;
  document: LabelingDocument;
  history: UseLabelingHistoryResult;
}

const LabelingContext = createContext<LabelingContextValue>({
  pushLabeling: () => void 0,
  removeLabeling: () => void 0,
  history: {
    message: "",
    redoLabeling: () => void 0,
    undoLabeling: () => void 0,
    setLabeling: () => void 0,
    data: {
      objects: [],
    },
  },
  document: {
    comments: [],
    contributors: [],
    created: "",
    data: {
      objects: [],
    },
    filename: "",
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

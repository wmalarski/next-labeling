import { createContext } from "react";
import { LabelingDocument } from "./types";

export interface LabelingContextValue {
  document: LabelingDocument;
  updateDoc: (doc: LabelingDocument) => void;
  removeDoc: (doc: LabelingDocument) => void;
  pushDoc: (
    provider: (doc: LabelingDocument) => LabelingDocument | undefined,
  ) => void;
}

const LabelingContext = createContext<LabelingContextValue>({
  document: {
    comments: [],
    contributors: [],
    created: "",
    editedDate: "",
    filename: "",
    id: "",
    name: "",
    objects: [],
    public: false,
    schemaId: "",
    stars: 0,
    user: {
      displayName: "",
      email: "",
      emailVerified: false,
      id: "",
    },
  },
  pushDoc: () => void 0,
  updateDoc: () => void 0,
  removeDoc: () => void 0,
});

export default LabelingContext;

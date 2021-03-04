import { createContext } from "react";
import { ExternalDocument } from "../types/database";

export interface LabelingContextValue {
  saveLabeling: (doc: ExternalDocument) => void;
  removeLabeling: (doc: ExternalDocument) => void;
}

const LabelingContext = createContext<LabelingContextValue>({
  saveLabeling: () => void 0,
  removeLabeling: () => void 0,
});

export default LabelingContext;

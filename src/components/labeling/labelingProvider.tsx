import React from "react";
import LabelingContext from "../../utils/labeling/labelingContext";
import { LabelingDocument } from "../../utils/labeling/types";

export interface LabelingProviderProps {
  document: LabelingDocument;
  children: React.ReactNode | React.ReactNode[] | null;
}

export function LabelingProvider(props: LabelingProviderProps): JSX.Element {
  const { document, children } = props;
  return (
    <LabelingContext.Provider
      value={{
        document,
        pushDoc: () => void 0,
        updateDoc: () => void 0,
        removeDoc: () => void 0,
      }}
    >
      {children}
    </LabelingContext.Provider>
  );
}

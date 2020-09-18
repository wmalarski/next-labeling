import "firebase/firestore";

import firebase from "firebase/app";
import { PathReporter } from "io-ts/lib/PathReporter";
import { useEffect, useState } from "react";
import { LabelingDocument } from "./types";
import { LabelingCollection, SchemaCollection } from "../firestore/types";
import { SchemaDocument } from "../schema/types";

export interface UseFetchLabelingResult {
  isLoading: boolean;
  document?: LabelingDocument;
  schema?: SchemaDocument;
  exist?: boolean;
  errors?: string[];
}

export default function useFetchLabeling(
  documentId?: string,
): UseFetchLabelingResult {
  const [state, setState] = useState<UseFetchLabelingResult>({
    isLoading: true,
  });

  useEffect(() => {
    if (!documentId) {
      setState({
        isLoading: false,
        exist: false,
      });
      return;
    }
    const db = firebase.firestore();
    db.collection(LabelingCollection)
      .doc(documentId)
      .get()
      .then(doc => {
        const data = doc.data();
        if (!doc.exists || !data) {
          setState({
            isLoading: false,
            exist: false,
          });
          return;
        }
        const decoded = LabelingDocument.decode(data);
        const errors =
          decoded._tag === "Left" ? PathReporter.report(decoded) : [];
        setState({
          isLoading: false,
          exist: true,
          errors,
          document: LabelingDocument.encode(data as LabelingDocument),
        });
      });
  }, [documentId]);

  return state;
}

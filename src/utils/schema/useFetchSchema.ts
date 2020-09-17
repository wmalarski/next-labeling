import "firebase/firestore";

import firebase from "firebase/app";
import { PathReporter } from "io-ts/lib/PathReporter";
import { useEffect, useState } from "react";

import { SchemaDocument, SchemaDocumentType } from "./types";
import { SchemaCollection } from "../firestore/collections";

export interface UseFetchSchemaResult {
  isLoading: boolean;
  document?: SchemaDocument;
  exist?: boolean;
  errors?: string[];
}

export default function useFetchSchema(
  documentId?: string,
): UseFetchSchemaResult {
  const [state, setState] = useState<UseFetchSchemaResult>({
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
    db.collection(SchemaCollection)
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
        const decoded = SchemaDocumentType.decode(data);
        const errors =
          decoded._tag === "Left" ? PathReporter.report(decoded) : [];
        setState({
          isLoading: false,
          exist: true,
          errors,
          document: SchemaDocumentType.encode(data as SchemaDocument),
        });
      });
  }, [documentId]);

  return state;
}

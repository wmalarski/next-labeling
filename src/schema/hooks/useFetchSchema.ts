import "firebase/firestore";

import firebase from "firebase/app";

import { SchemaCollection } from "../../firestore/types";
import useFetchDocument from "../../firestore/hooks/useFetchDocument";
import { SchemaDocument } from "../types";
import { useCallback } from "react";

export interface UseFetchSchemaResult {
  isLoading: boolean;
  document?: SchemaDocument;
  exist?: boolean;
  errors?: string[];
}

export default function useFetchSchema(
  documentId?: string,
): UseFetchSchemaResult {
  const collection = useCallback(
    () => firebase.firestore().collection(SchemaCollection),
    [],
  );
  return useFetchDocument<SchemaDocument>({
    type: SchemaDocument,
    documentId,
    collection,
  });
}

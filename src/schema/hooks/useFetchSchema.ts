import firebase from "firebase/app";
import "firebase/firestore";
import { useCallback } from "react";
import useFetchDocument from "../../firebase/hooks/useFetchDocument";
import { SchemaCollection } from "../../firebase/types";
import { SchemaDocument } from "../types";

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

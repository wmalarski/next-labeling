import "firebase/firestore";

import firebase from "firebase/app";

import { SchemaCollection } from "../firestore/types";
import useFetchDocument from "../firestore/useFetchDocument";
import { SchemaDocument } from "./types";

export interface UseFetchSchemaResult {
  isLoading: boolean;
  document?: SchemaDocument;
  exist?: boolean;
  errors?: string[];
}

export default function useFetchSchema(
  documentId?: string,
): UseFetchSchemaResult {
  const db = firebase.firestore();
  const collection = db.collection(SchemaCollection);
  return useFetchDocument<SchemaDocument>({
    type: SchemaDocument,
    documentId,
    collection,
  });
}

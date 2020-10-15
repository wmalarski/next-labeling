import "firebase/firestore";

import firebase from "firebase/app";

import { ProjectCollection } from "../../firestore/types";
import useFetchDocument from "../../firestore/useFetchDocument";
import { ProjectDocument } from "../types";

export interface UseFetchProjectResult {
  isLoading: boolean;
  document?: ProjectDocument;
  exist?: boolean;
  errors?: string[];
}

export default function useFetchProject(
  documentId?: string,
): UseFetchProjectResult {
  const db = firebase.firestore();
  const collection = db.collection(ProjectCollection);
  return useFetchDocument<ProjectDocument>({
    type: ProjectDocument,
    documentId,
    collection,
  });
}

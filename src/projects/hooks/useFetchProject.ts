import firebase from "firebase/app";
import "firebase/firestore";
import { useCallback } from "react";
import useFetchDocument from "../../firebase/hooks/useFetchDocument";
import { ProjectCollection } from "../../firebase/types";
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
  const collection = useCallback(
    () => firebase.firestore().collection(ProjectCollection),
    [],
  );
  return useFetchDocument<ProjectDocument>({
    type: ProjectDocument,
    documentId,
    collection,
  });
}

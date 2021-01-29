import firebase from "firebase/app";
import {
  ProjectDocument,
  ProjectDocumentPair,
  WorkflowDocument,
} from "./types";

export function decodeProjectDocument(
  document: firebase.firestore.DocumentData,
): ProjectDocumentPair | null {
  const data = document.data();
  const decoded = ProjectDocument.decode(data);
  if (decoded._tag === "Left") return null;
  return {
    id: document.id,
    project: ProjectDocument.encode(data),
  };
}

export function normalizeWorkflowRoles(
  workflow: WorkflowDocument,
): WorkflowDocument {
  return workflow;
}

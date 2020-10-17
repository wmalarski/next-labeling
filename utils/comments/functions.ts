import firebase from "firebase/app";

import { CommentDocument, CommentDocumentPair } from "./types";

export function decodeCommentDocument(
  document: firebase.firestore.DocumentData,
): CommentDocumentPair | null {
  const data = document.data();
  const decoded = CommentDocument.decode(data);
  if (decoded._tag === "Left") return null;
  return { comment: CommentDocument.encode(data), id: document.id };
}

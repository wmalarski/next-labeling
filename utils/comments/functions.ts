import firebase from "firebase/app";

import { CommentDocument } from "./types";

export function decodeCommentDocument(
  document: firebase.firestore.DocumentData,
): CommentDocument | null {
  const data = document.data();
  const decoded = CommentDocument.decode(data);
  if (decoded._tag === "Left") return null;
  return { ...CommentDocument.encode(data), id: document.id };
}

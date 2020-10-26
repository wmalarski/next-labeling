import { CommentDocument } from "./types";

const commentConverter = {
  toFirestore(doc: CommentDocument): firebase.firestore.DocumentData {
    return CommentDocument.encode(doc);
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot,
    options: firebase.firestore.SnapshotOptions,
  ): CommentDocument {
    return CommentDocument.encode(snapshot.data(options) as CommentDocument);
  },
};

export default commentConverter;

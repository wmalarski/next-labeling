import firebase from "firebase/app";
import { ExternalDocument } from "../workspace/types/database";

const labelingConverter = {
  toFirestore(doc: ExternalDocument): firebase.firestore.DocumentData {
    return ExternalDocument.encode(doc);
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot,
    options: firebase.firestore.SnapshotOptions,
  ): ExternalDocument {
    return ExternalDocument.encode(snapshot.data(options) as ExternalDocument);
  },
};

export default labelingConverter;

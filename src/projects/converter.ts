import firebase from "firebase/app";

import { ProjectDocument } from "./types";

export const projectConverter = {
  toFirestore(doc: ProjectDocument): firebase.firestore.DocumentData {
    return ProjectDocument.encode(doc);
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot,
    options: firebase.firestore.SnapshotOptions,
  ): ProjectDocument {
    return ProjectDocument.encode(snapshot.data(options) as ProjectDocument);
  },
};

export default projectConverter;

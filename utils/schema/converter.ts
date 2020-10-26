import { SchemaDocument } from "./types";

const schemaConverter = {
  toFirestore(schema: SchemaDocument): firebase.firestore.DocumentData {
    return SchemaDocument.encode(schema);
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot,
    options: firebase.firestore.SnapshotOptions,
  ): SchemaDocument {
    const data = snapshot.data(options) as SchemaDocument;
    return SchemaDocument.encode(data);
  },
};

export default schemaConverter;

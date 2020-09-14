import { AuthUser } from "../auth/user";
import { SchemaDocument, LabelingSchema } from "./types";
import firebase from "firebase/app";

export interface SaveSchemaResult {
  errors: string[];
  document?: SchemaDocument;
}

export async function saveSchema(
  schema: LabelingSchema,
  user: AuthUser,
): Promise<SaveSchemaResult> {
  if (!user) return { errors: ["Not authorized"] };
  const errors: string[] = [];
  try {
    const db = firebase.firestore();
    const collection = db.collection("spaces");

    const document: SchemaDocument = {
      schema: schema,
      stars: 0,
      user: user,
      created: new Date(),
    };
    const snap = await collection.add(document);
    return { errors, document: { ...document, id: snap.id } };
  } catch (error) {
    errors.push(`${error}`);
  }
  return { errors };
}

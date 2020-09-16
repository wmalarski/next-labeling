import firebase from "firebase/app";
import { PathReporter } from "io-ts/lib/PathReporter";
import { useEffect, useState } from "react";

import { AuthUser } from "../auth/user";
import { LabelingSchema, SchemaDocument, SchemaDocumentType } from "./types";

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

export interface UseFirebaseSchemaResult {
  isLoading: boolean;
  document?: SchemaDocument;
  exist?: boolean;
  errors?: string[];
}

export function useFirebaseSchema(
  documentId?: string,
): UseFirebaseSchemaResult {
  const [state, setState] = useState<UseFirebaseSchemaResult>({
    isLoading: true,
  });

  useEffect(() => {
    if (!documentId) {
      setState({
        isLoading: false,
        exist: false,
      });
      return;
    }
    const db = firebase.firestore();
    db.collection("spaces")
      .doc(documentId)
      .get()
      .then(doc => {
        const data = doc.data();
        if (!doc.exists || !data) {
          setState({
            isLoading: false,
            exist: false,
          });
          return;
        }
        const decoded = SchemaDocumentType.decode(data);
        const errors =
          decoded._tag === "Left" ? PathReporter.report(decoded) : [];
        setState({
          isLoading: false,
          exist: true,
          errors,
          document: SchemaDocumentType.encode(data as SchemaDocument),
        });
      });
  }, [documentId]);

  return state;
}

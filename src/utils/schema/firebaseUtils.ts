import { AuthUser } from "../auth/user";
import { LabelingSchema } from "./types";
import firebase from "firebase/app";

export interface SaveSchemaResult {
  errors: string[];
  schema: LabelingSchema;
}

export async function saveSchema(
  schema: LabelingSchema,
  user: AuthUser
): Promise<SaveSchemaResult> {
  if (!user) return { errors: ["Not authorized"], schema };
  const errors: string[] = [];
  try {
    const db = firebase.firestore();
    const collection = db.collection("spaces");

    // Not saved yet
    if (!schema.id) {
      const snap = await collection.add({ ...schema, user });
      return { errors, schema: { ...schema, id: snap.id } };
    } else {
      const ref = collection.doc(schema.id);
      const snap = await ref.get();

      // TODO: Save when exist
      if (!snap.exists) {
        errors.push("Not valid schema id.");
      } else {
        console.log("ref", ref, snap);
      }
    }

    // if (snap.exists) {
    //   throw `a space with that ID already exists`;
    // }
    // await ref.set({
    //   spaceId: inputs.spaceId,
    //   title: inputs.title,
    //   uid: authUser.id,
    // });
    // router.push("/schema");
  } catch (error) {
    errors.push(`${error}`);
  }
  return { errors, schema };
}

import firebase from "firebase/app";
import { FirestoreDate } from "./types";

export function convertToDate(date: unknown): Date | null {
  const struct = date as FirestoreDate | null;
  return (
    struct &&
    new firebase.firestore.Timestamp(
      struct.seconds,
      struct.nanoseconds,
    ).toDate()
  );
}

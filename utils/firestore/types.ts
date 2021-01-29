import "firebase/firestore";

import firebase from "firebase/app";

export const ProjectCollection = "projects";
export const SchemaCollection = "spaces";
export const LabelingCollection = "labeling";
export const CommentsCollection = "comments";

export interface ResultSnackbarState {
  isOpen: boolean;
  message?: string;
}

export interface DocumentWithId {
  id?: string;
}

export type FirestoreCollection = firebase.firestore.CollectionReference<firebase.firestore.DocumentData>;

export type FirestoreQuery<
  T = firebase.firestore.DocumentData
> = firebase.firestore.Query<T>;

export interface FirestoreDate {
  seconds: number;
  nanoseconds: number;
}

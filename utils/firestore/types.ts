import "firebase/firestore";

import firebase from "firebase/app";

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

export type FirestoreCollection = firebase.firestore.CollectionReference<
  firebase.firestore.DocumentData
>;

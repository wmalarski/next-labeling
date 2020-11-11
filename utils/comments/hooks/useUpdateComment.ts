import "firebase/firestore";

import firebase from "firebase/app";

import { CommentsCollection, LabelingCollection } from "../../firestore/types";
import useUpdateDocument, {
  UseUpdateDocumentResult,
} from "../../firestore/useUpdateDocument";
import { CommentDocument } from "../types";

export default function useUpdateComment(
  labelingDocumentId: string,
): UseUpdateDocumentResult<CommentDocument> {
  return useUpdateDocument<CommentDocument>(
    firebase
      .firestore()
      .collection(LabelingCollection)
      .doc(labelingDocumentId)
      .collection(CommentsCollection),
  );
}
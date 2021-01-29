import firebase from "firebase/app";
import "firebase/firestore";
import useUpdateDocument, {
  UseUpdateDocumentResult,
} from "../../firestore/hooks/useUpdateDocument";
import { CommentsCollection, LabelingCollection } from "../../firestore/types";
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

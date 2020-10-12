import "firebase/firestore";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import firebase from "firebase/app";
import React, { useState } from "react";

import { useAuthUserInfo } from "../../utils/auth/hooks";
import { CommentDocument } from "../../utils/comments/types";
import {
  CommentsCollection,
  LabelingCollection,
} from "../../utils/firestore/types";
import useCreateDocument from "../../utils/firestore/useCreateDocument";

export interface CommentInputProps {
  documentId: string;
}

export default function CommentInput(props: CommentInputProps): JSX.Element {
  const { documentId } = props;

  const { authUser } = useAuthUserInfo();
  const [value, setValue] = useState("");

  const db = firebase.firestore();
  const collection = db
    .collection(LabelingCollection)
    .doc(documentId)
    .collection(CommentsCollection);

  const { create } = useCreateDocument<CommentDocument>(collection);

  return (
    <>
      <TextField
        value={value}
        onChange={event => setValue(event.target.value)}
      />
      <Button
        color="inherit"
        onClick={() => {
          if (!authUser) return;
          create({
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            parentId: null,
            isEdited: false,
            isAction: false,
            isResolved: false,
            isThread: true,
            message: value,
            reactions: [],
            snapshot: null,
            user: authUser,
          });
          setValue("");
        }}
      >
        Add
      </Button>
    </>
  );
}

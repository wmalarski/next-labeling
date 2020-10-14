import "firebase/firestore";

import { RadioGroup } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel/FormLabel";
import Radio from "@material-ui/core/Radio/Radio";
import TextField from "@material-ui/core/TextField";
import firebase from "firebase/app";
import React, { useCallback, useState } from "react";

import { useAuthUserInfo } from "../../utils/auth/hooks";
import { AuthUser } from "../../utils/auth/user";
import { CommentDocument, CommentSnapshot } from "../../utils/comments/types";
import useLabelingContext from "../../utils/labeling/hooks/useLabelingContext";
import { LabelingDocument } from "../../utils/labeling/types/client";
import { ExternalObject } from "../../utils/labeling/types/database";

enum SnapshotType {
  NO = "NO",
  PARTIAL = "PARTIAL",
  FULL = "FULL",
}

function calculateSnapshot(
  data: LabelingDocument,
  state: SnapshotType,
): CommentSnapshot | null {
  const { currentFrame, selected, toggled, objects } = data;
  switch (state) {
    case SnapshotType.NO:
      return null;
    case SnapshotType.PARTIAL:
      return { currentFrame, selected, toggled, objects: null };
    case SnapshotType.FULL:
      return {
        currentFrame,
        selected,
        toggled,
        objects: objects.map(ExternalObject.encode),
      };
  }
}

export interface CommentInputProps {
  onSave: (comment: Partial<CommentDocument>) => void;
}

export default function CommentInput(props: CommentInputProps): JSX.Element {
  const { onSave } = props;

  const { authUser } = useAuthUserInfo();
  const { history } = useLabelingContext();
  const [message, setMessage] = useState("");
  const [snapType, setSnapType] = useState<SnapshotType>(SnapshotType.NO);

  const createComment = useCallback(
    (
      text: string,
      user: AuthUser,
      isThread: boolean,
      snapshot: CommentSnapshot | null,
    ) =>
      onSave({
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        parentId: null,
        isEdited: false,
        isAction: false,
        isResolved: false,
        isThread,
        message: text,
        reactions: [],
        snapshot,
        user,
      }),
    [onSave],
  );

  return (
    <>
      <TextField
        value={message}
        onChange={event => setMessage(event.target.value)}
      />
      <Button
        color="inherit"
        onClick={() => {
          if (!authUser) return;
          createComment(
            message,
            authUser,
            false,
            calculateSnapshot(history.data, snapType),
          );
          setMessage("");
        }}
      >
        Comment
      </Button>
      <Button
        color="inherit"
        onClick={() => {
          if (!authUser) return;
          createComment(
            message,
            authUser,
            true,
            calculateSnapshot(history.data, snapType),
          );
          setMessage("");
        }}
      >
        Start thread
      </Button>
      <FormControl component="fieldset">
        <FormLabel component="legend">Snapshot</FormLabel>
        <RadioGroup
          row
          aria-label="position"
          name="position"
          defaultValue="top"
        >
          {Object.keys(SnapshotType).map(value => (
            <FormControlLabel
              key={value}
              control={
                <Radio
                  value={value}
                  color="primary"
                  checked={snapType === value}
                  onChange={() => setSnapType(value as SnapshotType)}
                />
              }
              label={value}
              labelPlacement="bottom"
            />
          ))}
        </RadioGroup>
      </FormControl>
    </>
  );
}

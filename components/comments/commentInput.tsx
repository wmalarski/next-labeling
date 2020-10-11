import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import React, { useState } from "react";

export interface CommentInputProps {
  documentId: string;
}

export default function CommentInput(props: CommentInputProps): JSX.Element {
  const [value, setValue] = useState("");

  return (
    <>
      <TextField
        value={value}
        onChange={event => setValue(event.target.value)}
      />
      <Button color="inherit">Add</Button>
    </>
  );
}

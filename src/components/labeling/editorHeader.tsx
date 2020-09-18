import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import RedoIcon from "@material-ui/icons/Redo";
import SaveIcon from "@material-ui/icons/Save";
import UndoIcon from "@material-ui/icons/Undo";
import { useRouter } from "next/router";
import React, { useContext } from "react";

import LabelingContext from "../../contexts/labeling/labelingContext";

export default function EditorHeader(): JSX.Element {
  const router = useRouter();

  const { document, updateDoc, removeDoc } = useContext(LabelingContext);

  return (
    <ButtonGroup size="small" color="inherit" variant="text">
      <Button startIcon={<UndoIcon />} onClick={() => updateDoc(document)}>
        Undo
      </Button>
      <Button startIcon={<RedoIcon />} onClick={() => removeDoc(document)}>
        Redo
      </Button>
      <Button startIcon={<SaveIcon />} onClick={() => updateDoc(document)}>
        Save
      </Button>
      <Button
        startIcon={<DeleteOutlineIcon />}
        onClick={() => removeDoc(document)}
      >
        Remove
      </Button>
      <Button startIcon={<ExitToAppIcon />} onClick={() => router.back()}>
        Exit
      </Button>
    </ButtonGroup>
  );
}

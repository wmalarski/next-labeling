import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import RedoIcon from "@material-ui/icons/Redo";
import SaveIcon from "@material-ui/icons/Save";
import UndoIcon from "@material-ui/icons/Undo";
import { useRouter } from "next/router";
import React, { useContext } from "react";

import LabelingContext from "../../utils/labeling/contexts/labelingContext";
import { LabelingDocument } from "../../utils/labeling/types";

export default function EditorHeader(): JSX.Element {
  const router = useRouter();

  const { document, saveLabeling, removeLabeling, history } = useContext(
    LabelingContext,
  );

  return (
    <ButtonGroup size="small" color="inherit" variant="text">
      {history.undoMessage ? (
        <Tooltip title={history.message}>
          <Button startIcon={<UndoIcon />} onClick={history.undoLabeling}>
            Undo
          </Button>
        </Tooltip>
      ) : (
        <Button startIcon={<UndoIcon />} disabled>
          Undo
        </Button>
      )}
      {history.redoMessage ? (
        <Tooltip title={history.redoMessage}>
          <Button startIcon={<RedoIcon />} onClick={history.redoLabeling}>
            Redo
          </Button>
        </Tooltip>
      ) : (
        <Button startIcon={<RedoIcon />} disabled>
          Redo
        </Button>
      )}
      <Button
        startIcon={<SaveIcon />}
        onClick={() => {
          saveLabeling(
            LabelingDocument.encode({
              ...document,
              objects: history.data.objects,
            }),
          );
        }}
      >
        Save
      </Button>
      <Button
        startIcon={<DeleteOutlineIcon />}
        onClick={() => removeLabeling(document)}
      >
        Remove
      </Button>
      <Button startIcon={<ExitToAppIcon />} onClick={() => router.back()}>
        Exit
      </Button>
    </ButtonGroup>
  );
}

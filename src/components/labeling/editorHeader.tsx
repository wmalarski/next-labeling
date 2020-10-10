import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import RedoIcon from "@material-ui/icons/Redo";
import SaveIcon from "@material-ui/icons/Save";
import UndoIcon from "@material-ui/icons/Undo";
import { useRouter } from "next/router";
import React from "react";
import { useHotkeys } from "react-hotkeys-hook";

import useLabelingContext from "../../utils/labeling/hooks/useLabelingContext";
import usePreferences from "../../utils/labeling/hooks/usePreferencesContext";
import { LabelingDocument } from "../../utils/labeling/types";

export default function EditorHeader(): JSX.Element {
  const router = useRouter();

  const { preferences } = usePreferences();
  const { shortcuts } = preferences;
  const {
    document,
    saveLabeling,
    removeLabeling,
    history,
  } = useLabelingContext();
  const {
    undoLabeling,
    redoLabeling,
    message,
    undoMessage,
    redoMessage,
    data,
  } = history;

  useHotkeys(shortcuts.Undo, undoLabeling, [undoLabeling]);
  useHotkeys(shortcuts.Redo, redoLabeling, [redoLabeling]);

  return (
    <ButtonGroup size="small" color="inherit" variant="text">
      {undoMessage ? (
        <Tooltip title={message}>
          <Button startIcon={<UndoIcon />} onClick={undoLabeling}>
            Undo
          </Button>
        </Tooltip>
      ) : (
        <Button startIcon={<UndoIcon />} disabled>
          Undo
        </Button>
      )}
      {redoMessage ? (
        <Tooltip title={redoMessage}>
          <Button startIcon={<RedoIcon />} onClick={redoLabeling}>
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
              objects: data.objects,
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

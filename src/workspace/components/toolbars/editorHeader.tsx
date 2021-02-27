import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import SaveIcon from "@material-ui/icons/Save";
import { useRouter } from "next/router";
import React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useSelector } from "react-redux";
import useLabelingAutoSave from "../../hooks/useLabelingAutoSave";
import useLabelingContext from "../../hooks/useLabelingContext";
import { initialDocumentSelector } from "../../redux/selectors/common-selectors";
import { objectsSelector } from "../../redux/selectors/doc-selectors";
import { shortcutsSelector } from "../../redux/selectors/preferences-selectors";
import { ExternalDocument } from "../../types/database";
import UndoRedoButtons from "./undoRedoButtons";

export default function EditorHeader(): JSX.Element {
  const router = useRouter();

  const { saveLabeling, removeLabeling } = useLabelingContext();
  const initialDoc = useSelector(initialDocumentSelector);
  const objects = useSelector(objectsSelector);
  const shortcuts = useSelector(shortcutsSelector);

  const saveCallback = () =>
    saveLabeling(ExternalDocument.encode({ ...initialDoc, objects }));

  useLabelingAutoSave();
  useHotkeys(shortcuts.SaveDatabase, saveCallback, [saveCallback]);

  return (
    <ButtonGroup size="small" color="inherit" variant="text">
      <UndoRedoButtons />
      <Button startIcon={<SaveIcon />} onClick={saveCallback}>
        Save
      </Button>
      <Button
        startIcon={<DeleteOutlineIcon />}
        onClick={() => removeLabeling(initialDoc)}
      >
        Remove
      </Button>
      <Button startIcon={<ExitToAppIcon />} onClick={() => router.back()}>
        Exit
      </Button>
    </ButtonGroup>
  );
}

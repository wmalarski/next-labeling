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
import usePreferences from "../../hooks/usePreferencesContext";
import {
  currentDocumentSelector,
  initialDocumentSelector,
} from "../../redux/selectors";
import { ExternalDocument } from "../../types/database";
import UndoRedoButtons from "./undoRedoButtons";

export default function EditorHeader(): JSX.Element {
  const router = useRouter();

  const { saveLabeling, removeLabeling } = useLabelingContext();
  const initialDoc = useSelector(initialDocumentSelector);
  const currentDoc = useSelector(currentDocumentSelector);

  const { preferences } = usePreferences();
  const { shortcuts } = preferences;

  const saveCallback = () =>
    saveLabeling(
      ExternalDocument.encode({
        ...initialDoc,
        objects: currentDoc.objects,
      }),
    );

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

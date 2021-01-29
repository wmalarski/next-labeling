import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import SaveIcon from "@material-ui/icons/Save";
import { useRouter } from "next/router";
import React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import useLabelingAutoSave from "../../../labeling/hooks/useLabelingAutoSave";
import useLabelingContext from "../../../labeling/hooks/useLabelingContext";
import usePreferences from "../../../labeling/hooks/usePreferencesContext";
import { ExternalDocument } from "../../../labeling/types/database";
import UndoRedoButtons from "./undoRedoButtons";

export default function EditorHeader(): JSX.Element {
  const router = useRouter();

  const {
    document,
    saveLabeling,
    removeLabeling,
    history,
  } = useLabelingContext();
  const { data } = history;
  const { preferences } = usePreferences();
  const { shortcuts } = preferences;

  const saveCallback = () =>
    saveLabeling(
      ExternalDocument.encode({
        ...document,
        objects: data.objects,
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

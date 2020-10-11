import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import SaveIcon from "@material-ui/icons/Save";
import { useRouter } from "next/router";
import React from "react";
import { useHotkeys } from "react-hotkeys-hook";

import { useLabelingAutosave } from "../../utils/labeling/hooks/useLabelingAutosave";
import useLabelingContext from "../../utils/labeling/hooks/useLabelingContext";
import usePreferences from "../../utils/labeling/hooks/usePreferencesContext";
import { ExternalDocument } from "../../utils/labeling/types/database";
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

  useLabelingAutosave();
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

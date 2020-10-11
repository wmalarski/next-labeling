import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import SaveIcon from "@material-ui/icons/Save";
import { useRouter } from "next/router";
import React from "react";

import useLabelingContext from "../../utils/labeling/hooks/useLabelingContext";
import { LabelingDocument } from "../../utils/labeling/types";
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

  return (
    <ButtonGroup size="small" color="inherit" variant="text">
      <UndoRedoButtons />
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

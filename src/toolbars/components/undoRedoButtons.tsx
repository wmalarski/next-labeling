import { ButtonProps } from "@material-ui/core/Button";
import RedoIcon from "@material-ui/icons/Redo";
import UndoIcon from "@material-ui/icons/Undo";
import React, { useCallback } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useSelector } from "react-redux";
import ButtonTooltip from "../../common/components/buttonTooltip";
import { useRootDispatch } from "../../common/redux/store";
import { shortcutsSelector } from "../../preferences/redux/selectors";
import { redoLabeling, undoLabeling } from "../../workspace/redux/slice";
import {
  currentSnapshotSelector,
  redoMessageSelector,
  undoMessageSelector,
} from "../redux/selectors";

function UndoRedoButtons(): JSX.Element {
  const dispatch = useRootDispatch();
  const { message } = useSelector(currentSnapshotSelector);
  const undoMessage = useSelector(undoMessageSelector);
  const redoMessage = useSelector(redoMessageSelector);
  const shortcuts = useSelector(shortcutsSelector);

  const handleUndoLabeling = useCallback(
    (): void => void dispatch(undoLabeling()),
    [dispatch],
  );
  const handleRedoLabeling = useCallback(
    (): void => void dispatch(redoLabeling()),
    [dispatch],
  );

  useHotkeys(shortcuts.Undo, handleUndoLabeling, [handleUndoLabeling]);
  useHotkeys(shortcuts.Redo, handleRedoLabeling, [handleRedoLabeling]);

  const styleArgs: Partial<ButtonProps> = {
    size: "small",
    color: "inherit",
    variant: "text",
  };

  return (
    <>
      <ButtonTooltip
        {...styleArgs}
        title={message}
        disabled={!undoMessage}
        startIcon={<UndoIcon />}
        onClick={handleUndoLabeling}
      >
        Undo
      </ButtonTooltip>
      <ButtonTooltip
        {...styleArgs}
        title={redoMessage}
        disabled={!redoMessage}
        startIcon={<RedoIcon />}
        onClick={handleRedoLabeling}
      >
        Redo
      </ButtonTooltip>
    </>
  );
}

export default React.memo(UndoRedoButtons);

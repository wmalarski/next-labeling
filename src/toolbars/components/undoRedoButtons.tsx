import Button, { ButtonProps } from "@material-ui/core/Button";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import Tooltip from "@material-ui/core/Tooltip";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ChangeHistoryIcon from "@material-ui/icons/ChangeHistory";
import RedoIcon from "@material-ui/icons/Redo";
import UndoIcon from "@material-ui/icons/Undo";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useSelector } from "react-redux";
import { useRootDispatch } from "../../common/redux/store";
import { shortcutsSelector } from "../../preferences/redux/selectors";
import {
  redoLabeling,
  setSnapshotId,
  undoLabeling,
} from "../../workspace/redux/slice";
import actionIcons from "../actionIcons";
import {
  currentSnapshotSelector,
  historySelector,
  redoMessageSelector,
  undoMessageSelector,
} from "../redux/selectors";

export default function UndoRedoButtons(): JSX.Element {
  const dispatch = useRootDispatch();
  const { id: currentId, message } = useSelector(currentSnapshotSelector);
  const undoMessage = useSelector(undoMessageSelector);
  const redoMessage = useSelector(redoMessageSelector);
  const history = useSelector(historySelector);
  const shortcuts = useSelector(shortcutsSelector);

  const handleUndoLabeling = useCallback(
    (): void => void dispatch(undoLabeling()),
    [dispatch],
  );
  const handleRedoLabeling = useCallback(
    (): void => void dispatch(redoLabeling()),
    [dispatch],
  );
  const messages = useMemo(
    () =>
      history.map(pair => ({
        message: pair.message,
        id: pair.id,
        action: pair.action,
      })),
    [history],
  );

  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

  const handleToggle = useCallback(() => setOpen(prevState => !prevState), []);
  const handleClose = useCallback(() => setOpen(false), []);

  useHotkeys(shortcuts.Undo, handleUndoLabeling, [handleUndoLabeling]);
  useHotkeys(shortcuts.Redo, handleRedoLabeling, [handleRedoLabeling]);

  const styleArgs: Partial<ButtonProps> = {
    size: "small",
    color: "inherit",
    variant: "text",
  };

  return (
    <>
      {undoMessage ? (
        <Tooltip title={message}>
          <Button
            {...styleArgs}
            startIcon={<UndoIcon />}
            onClick={handleUndoLabeling}
          >
            Undo
          </Button>
        </Tooltip>
      ) : (
        <Button {...styleArgs} startIcon={<UndoIcon />} disabled>
          Undo
        </Button>
      )}
      {redoMessage ? (
        <Tooltip title={redoMessage}>
          <Button
            {...styleArgs}
            startIcon={<RedoIcon />}
            onClick={handleRedoLabeling}
          >
            Redo
          </Button>
        </Tooltip>
      ) : (
        <Button {...styleArgs} startIcon={<RedoIcon />} disabled>
          Redo
        </Button>
      )}
      <Button
        ref={anchorRef}
        {...styleArgs}
        aria-controls={open ? "split-button-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-label="select merge strategy"
        aria-haspopup="menu"
        onClick={handleToggle}
      >
        <ArrowDropDownIcon />
      </Button>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu">
                  {[...messages].reverse().map(messagePair => {
                    const ActionIcon =
                      (messagePair.action
                        ? actionIcons[messagePair.action]
                        : null) ?? ChangeHistoryIcon;
                    return (
                      <MenuItem
                        key={messagePair.id}
                        selected={messagePair.id === currentId}
                        onClick={() => dispatch(setSnapshotId(messagePair.id))}
                      >
                        <ListItemIcon>
                          <ActionIcon />
                        </ListItemIcon>
                        <ListItemText primary={messagePair.message} />
                      </MenuItem>
                    );
                  })}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
}

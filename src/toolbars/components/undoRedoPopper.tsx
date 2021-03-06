import Button from "@material-ui/core/Button";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ChangeHistoryIcon from "@material-ui/icons/ChangeHistory";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useRootDispatch } from "../../common/redux/store";
import { setSnapshotId } from "../../workspace/redux/slice";
import actionIcons from "../actionIcons";
import { currentSnapshotSelector, historySelector } from "../redux/selectors";

function UndoRedoPopper(): JSX.Element {
  const dispatch = useRootDispatch();
  const { id: currentId } = useSelector(currentSnapshotSelector);
  const history = useSelector(historySelector);

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

  return (
    <>
      <Button
        ref={anchorRef}
        size="small"
        color="inherit"
        variant="text"
        aria-controls={open ? "split-button-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-label="select undo redo action"
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

export default React.memo(UndoRedoPopper);

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import SettingsIcon from "@material-ui/icons/Settings";
import React, { useState } from "react";
import GeneralSettings from "./generalSettings";
import LabelingSettings from "./labelingSettings";
import ShortcutsSettingsTreeView from "./shortcutsSettingsTreeView";

function EditorSettingsDialog(): JSX.Element {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // TODO: https://github.com/wmalarski/next-labeling/issues/14
  return (
    <>
      <ListItem button onClick={handleClickOpen} selected={open}>
        <ListItemIcon>
          <SettingsIcon />
        </ListItemIcon>
        <ListItemText primary={"Settings"} />
      </ListItem>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Settings</DialogTitle>
        <DialogContent>
          <DialogContentText>General</DialogContentText>
          <GeneralSettings setOpen={setOpen} />
          <DialogContentText>Labeling</DialogContentText>
          <LabelingSettings />
          <DialogContentText>Shortcuts</DialogContentText>
          <ShortcutsSettingsTreeView />
          <DialogActions />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default React.memo(EditorSettingsDialog);

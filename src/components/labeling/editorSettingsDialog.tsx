import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import TextField from "@material-ui/core/TextField";
import SettingsIcon from "@material-ui/icons/Settings";
import React, { useState } from "react";

import useLabelingContext from "../../utils/labeling/useLabelingContext";

export default function EditorSettingsDialog(): JSX.Element {
  const { document, saveLabeling } = useLabelingContext();

  const [open, setOpen] = useState(false);
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [name, setName] = useState(document.name);
  const [filename, setFilename] = useState(document.filename);

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
          <DialogContentText>Labeling settings</DialogContentText>
          <TextField
            variant="outlined"
            fullWidth
            label="Name"
            value={name}
            margin="dense"
            onChange={event => setName(event.target.value)}
          />
          <TextField
            variant="outlined"
            fullWidth
            label="Filename"
            value={filename}
            margin="dense"
            onChange={event => setFilename(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button
            disabled={
              document.name?.length === 0 || document.filename?.length === 0
            }
            onClick={() => {
              if (name !== document.name || filename !== document.filename) {
                saveLabeling({ ...document, name, filename });
              }
              handleClose();
            }}
            color="inherit"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

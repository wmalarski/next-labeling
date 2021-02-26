import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import TextField from "@material-ui/core/TextField";
import SettingsIcon from "@material-ui/icons/Settings";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup/ToggleButtonGroup";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import NumberInput from "../../../common/components/numberInput";
import { LabelingDirection } from "../../contexts/preferencesContext";
import useLabelingContext from "../../hooks/useLabelingContext";
import usePreferences from "../../hooks/usePreferencesContext";
import { initialDocumentSelector } from "../../redux/selectors";
import ShortcutsSettingsTreeView from "./shortcutsSettingsTreeView";

export default function EditorSettingsDialog(): JSX.Element {
  const { saveLabeling } = useLabelingContext();
  const initialDoc = useSelector(initialDocumentSelector);
  const { preferences, setPreferences } = usePreferences();

  const [open, setOpen] = useState(false);
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [name, setName] = useState(initialDoc.name);
  useEffect(() => setName(initialDoc.name), [initialDoc.name]);

  const [filename, setFilename] = useState(initialDoc.filename);
  useEffect(() => setFilename(initialDoc.filename), [initialDoc.filename]);

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
          <DialogActions>
            <Button onClick={handleClose} color="inherit">
              Cancel
            </Button>
            <Button
              disabled={
                initialDoc.name?.length === 0 ||
                initialDoc.filename?.length === 0
              }
              onClick={() => {
                if (
                  name !== initialDoc.name ||
                  filename !== initialDoc.filename
                ) {
                  saveLabeling({ ...initialDoc, name, filename });
                }
                handleClose();
              }}
              color="inherit"
            >
              Save
            </Button>
          </DialogActions>
          <DialogContentText>Labeling</DialogContentText>
          <Grid container>
            <Grid item xs={4}>
              Labeling Direction
            </Grid>
            <Grid item xs={6}>
              <ToggleButtonGroup
                value={preferences.labelingDirection}
                exclusive
                onChange={(_event, value) =>
                  setPreferences({ ...preferences, labelingDirection: value })
                }
                aria-label="text alignment"
              >
                <ToggleButton
                  value={LabelingDirection.BACKWARD}
                  aria-label="backward"
                >
                  Backward
                </ToggleButton>
                <ToggleButton
                  value={LabelingDirection.FORWARD}
                  aria-label="forward"
                >
                  Forward
                </ToggleButton>
              </ToggleButtonGroup>
            </Grid>
            <Grid item xs={4}>
              Frame step
            </Grid>
            <Grid item xs={6}>
              <NumberInput
                max={16}
                min={1}
                value={preferences.frameChangeStep}
                onChange={value =>
                  setPreferences({ ...preferences, frameChangeStep: value })
                }
              />
            </Grid>
            <Grid item xs={4}>
              Autosave interval(minutes)
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!preferences.autoSaveDelayMinutes}
                    onChange={() =>
                      setPreferences({
                        ...preferences,
                        autoSaveDelayMinutes: preferences.autoSaveDelayMinutes
                          ? null
                          : 5,
                      })
                    }
                    name="checkedA"
                  />
                }
                label="Enable"
              />
              <NumberInput
                max={16}
                min={1}
                disabled={!preferences.autoSaveDelayMinutes}
                value={preferences.autoSaveDelayMinutes ?? 5}
                onChange={value =>
                  setPreferences({
                    ...preferences,
                    autoSaveDelayMinutes: value,
                  })
                }
              />
            </Grid>
          </Grid>
          <DialogContentText>Shortcuts</DialogContentText>
          <ShortcutsSettingsTreeView />
          <DialogActions />
        </DialogContent>
      </Dialog>
    </>
  );
}

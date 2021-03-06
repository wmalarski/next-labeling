import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import TextField from "@material-ui/core/TextField";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useLabelingContext from "../../workspace/hooks/useLabelingContext";
import { initialDocumentSelector } from "../../workspace/redux/selectors";

export interface GeneralSettingsProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function GeneralSettings(props: GeneralSettingsProps): JSX.Element {
  const { setOpen } = props;
  const { saveLabeling } = useLabelingContext();

  const initial = useSelector(initialDocumentSelector);

  const handleClose = () => setOpen(false);

  const [name, setName] = useState(initial.name);
  useEffect(() => setName(initial.name), [initial.name]);

  const [filename, setFilename] = useState(initial.filename);
  useEffect(() => setFilename(initial.filename), [initial.filename]);

  // TODO: https://github.com/wmalarski/next-labeling/issues/14
  return (
    <>
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
            initial.name?.length === 0 || initial.filename?.length === 0
          }
          onClick={() => {
            if (name !== initial.name || filename !== initial.filename) {
              saveLabeling({ ...initial, name, filename });
            }
            handleClose();
          }}
          color="inherit"
        >
          Save
        </Button>
      </DialogActions>
    </>
  );
}

export default React.memo(GeneralSettings);

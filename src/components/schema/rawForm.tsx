import React, { useEffect, useRef, useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import EditIcon from "@material-ui/icons/Edit";
import { LabelingSchema } from "../../utils/schema/types";
import { NullableSchemaState } from "../../utils/schema/useSchemaHistory";
import TextField from "@material-ui/core/TextField";

export interface RawFormProps {
  schema: LabelingSchema;
  setSchema?: (setter: (schema: LabelingSchema) => NullableSchemaState) => void;
}

export default function RawForm(props: RawFormProps) {
  const { schema, setSchema } = props;

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(JSON.stringify(schema || {}, null, 2));

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button startIcon={<EditIcon />} onClick={() => setOpen(true)}>
        Edit Raw
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="lg"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">Edit Raw Schema</DialogTitle>
        <DialogContent dividers>
          <TextField
            id="outlined-multiline-static"
            label="Multiline"
            multiline
            fullWidth
            value={value}
            onChange={event => setValue(event.target.value)}
            variant="outlined"
            InputProps={{
              readOnly: !setSchema,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleClose();
            }}
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

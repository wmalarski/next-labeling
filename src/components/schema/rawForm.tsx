import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import EditIcon from "@material-ui/icons/Edit";
import { LabelingSchema } from "../../utils/schema/types";
import { NullableSchemaState } from "../../utils/schema/useSchemaHistory";
import TextField from "@material-ui/core/TextField";

function schemaToJson(schema: LabelingSchema): string {
  return JSON.stringify(schema || {}, null, 2);
}
export interface RawFormProps {
  schema: LabelingSchema;
  setSchema?: (setter: (schema: LabelingSchema) => NullableSchemaState) => void;
}

export default function RawForm(props: RawFormProps) {
  const { schema, setSchema } = props;

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(schemaToJson(schema));

  useEffect(() => {
    setValue(schemaToJson(schema));
  }, [schema, setValue]);

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
            disabled={!setSchema}
            onClick={() => {
              try {
                if (setSchema) {
                  const result = JSON.parse(value);
                  console.log({ result });
                  setSchema(() => ({ schema: result, message: "Raw Edit" }));
                  handleClose();
                }
              } catch (error) {
                alert({ error });
              }
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

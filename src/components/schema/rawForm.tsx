import React, { useEffect, useState } from "react";
import { PathReporter } from "io-ts/PathReporter";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import EditIcon from "@material-ui/icons/Edit";
import { LabelingSchema, LabelingSchemaType } from "../../utils/schema/types";
import { NullableSchemaState } from "../../utils/schema/useSchemaHistory";
import TextField from "@material-ui/core/TextField";
import Alert from "@material-ui/lab/Alert/Alert";

function schemaToJson(schema: LabelingSchema): string {
  return JSON.stringify(schema || {}, null, 2);
}

interface RawEditorState {
  text: string;
  errors: string[];
}

export interface RawFormProps {
  schema: LabelingSchema;
  setSchema?: (setter: (schema: LabelingSchema) => NullableSchemaState) => void;
}

export default function RawForm(props: RawFormProps) {
  const { schema, setSchema } = props;

  const [open, setOpen] = useState(false);
  const [state, setState] = useState<RawEditorState>({
    text: schemaToJson(schema),
    errors: [],
  });
  console.log({ errors: state.errors });

  useEffect(() => {
    setState({ text: schemaToJson(schema), errors: [] });
  }, [schema, setState]);

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
          {state.errors.map(error => (
            <Alert key={error} severity="error">
              {error}
            </Alert>
          ))}
          <TextField
            id="outlined-multiline-static"
            label="Multiline"
            multiline
            fullWidth
            value={state.text}
            onChange={event => {
              const text = event.target.value;
              try {
                const parsed = JSON.parse(text);
                const decoded = LabelingSchemaType.decode(parsed);
                const errors =
                  decoded._tag === "Left" ? PathReporter.report(decoded) : [];
                setState({ text, errors });
              } catch (error) {
                setState({ text, errors: [error.toString()] });
              }
            }}
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
            disabled={!setSchema || state.errors.length > 0}
            onClick={() => {
              if (setSchema) {
                const parsed = JSON.parse(state.text);
                const encoded = LabelingSchemaType.encode(parsed);
                setSchema(() => ({ schema: encoded, message: "Raw Edit" }));
                handleClose();
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

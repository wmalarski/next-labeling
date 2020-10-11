import Button, { ButtonProps } from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import Alert from "@material-ui/lab/Alert/Alert";
import { PathReporter } from "io-ts/PathReporter";
import React, { useEffect, useState } from "react";

import { Schema } from "../../../utils/schema/types";
import { SchemaState } from "../../../utils/schema/useSchemaHistory";

function schemaToJson(schema: Schema): string {
  return JSON.stringify(schema || {}, null, 2);
}

interface RawEditorState {
  text: string;
  errors: string[];
}

export interface RawFormProps extends ButtonProps {
  label: string;
  schema: Schema;
  setSchema?: (setter: (schema: Schema) => SchemaState | undefined) => void;
}

export default function RawForm(props: RawFormProps): JSX.Element {
  const { label, schema, setSchema, ...others } = props;

  const [open, setOpen] = useState(false);
  const [state, setState] = useState<RawEditorState>({
    text: schemaToJson(schema),
    errors: [],
  });

  useEffect(() => {
    setState({ text: schemaToJson(schema), errors: [] });
  }, [schema, setState]);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        size="small"
        color="inherit"
        {...others}
        onClick={() => setOpen(true)}
      >
        {label}
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="lg"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">{label}</DialogTitle>
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
                const decoded = Schema.decode(parsed);
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
          {setSchema ? (
            <Button
              disabled={state.errors.length > 0}
              onClick={() => {
                if (setSchema) {
                  const parsed = JSON.parse(state.text);
                  const encoded = Schema.encode(parsed);
                  setSchema(() => ({ schema: encoded, message: "Raw Edit" }));
                  handleClose();
                }
              }}
              color="primary"
            >
              Save
            </Button>
          ) : (
            <></>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}

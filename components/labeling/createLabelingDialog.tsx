import "firebase/firestore";

import Button, { ButtonProps } from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import PictureInPictureIcon from "@material-ui/icons/PictureInPicture";
import firebase from "firebase/app";
import React, { useContext, useState } from "react";

import { AuthUserInfoContext } from "../../utils/auth/hooks";
import { LabelingCollection } from "../../utils/firestore/types";
import useCreate from "../../utils/firestore/useCreate";
import { createObject } from "../../utils/labeling/functions";
import { ExternalDocument } from "../../utils/labeling/types/database";
import { SchemaDocument } from "../../utils/schema/types";

const defaultDocument: Partial<ExternalDocument> = {
  filename: "",
  stars: 0,
  public: true,
  contributors: [],
  fps: 24,
  name: "",
  objects: [],
};

export interface CreateLabelingDialogProps extends ButtonProps {
  schema: SchemaDocument;
}

export default function CreateLabelingDialog(
  props: CreateLabelingDialogProps,
): JSX.Element {
  const { schema, ...other } = props;

  const { authUser } = useContext(AuthUserInfoContext);
  const [document, setDocument] = useState<Partial<ExternalDocument>>({
    ...defaultDocument,
    schema: schema.schema,
    schemaId: schema.id,
    objects: schema.schema.objects
      .filter(object => object.singleton)
      .map(object => createObject(object, 0)),
  });

  const [open, setOpen] = useState(false);
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const db = firebase.firestore();
  const collection = db.collection(LabelingCollection);
  const createLabeling = useCreate<ExternalDocument>({
    collection,
    setSnackbarState: () => void 0,
    routerOptions: document => ({
      url: "/labeling/[labelingId]",
      as: `/labeling/${document.id}`,
    }),
  });

  if (!authUser) return <></>;

  return (
    <>
      <Button
        startIcon={<PictureInPictureIcon />}
        color="inherit"
        {...other}
        onClick={handleClickOpen}
      >
        Use
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Create new labeling</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Create new labeling for selected schema
          </DialogContentText>
          <TextField
            variant="outlined"
            fullWidth
            label="Name"
            value={document.name}
            margin="dense"
            onChange={event => {
              const name = event.target.value;
              setDocument(doc => ({ ...doc, name }));
            }}
          />
          <TextField
            variant="outlined"
            fullWidth
            label="Filename"
            value={document.filename}
            margin="dense"
            onChange={event => {
              const filename = event.target.value;
              setDocument(doc => ({ ...doc, filename }));
            }}
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
              createLabeling.create({
                ...document,
                created: new Date().toJSON(),
                edited: [
                  {
                    user: authUser,
                    date: new Date().toJSON(),
                  },
                ],
                user: authUser,
              });
              handleClose();
            }}
            color="inherit"
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

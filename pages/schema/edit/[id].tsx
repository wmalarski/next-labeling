import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Container from "@material-ui/core/Container";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import Tooltip from "@material-ui/core/Tooltip";
import CloseIcon from "@material-ui/icons/Close";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import RedoIcon from "@material-ui/icons/Redo";
import SaveIcon from "@material-ui/icons/Save";
import UndoIcon from "@material-ui/icons/Undo";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";

import Footer from "../../../src/components/common/footer";
import Header from "../../../src/components/common/header";
import SchemaForm from "../../../src/components/schema/forms/schemaForm";
import { AuthUserInfoContext } from "../../../src/utils/auth/hooks";
import initFirebase from "../../../src/utils/auth/initFirebase";
import withAuthUser from "../../../src/utils/pageWrappers/withAuthUser";
import withAuthUserInfo from "../../../src/utils/pageWrappers/withAuthUserInfo";
import {
  saveSchema,
  useFirebaseSchema,
} from "../../../src/utils/schema/firebaseUtils";
import useSchemaHistory from "../../../src/utils/schema/useSchemaHistory";

initFirebase();

function SchemaEdit(): JSX.Element {
  const { authUser } = useContext(AuthUserInfoContext);

  const router = useRouter();
  const { id: queryDocumentId } = router.query;
  const documentId = !Array.isArray(queryDocumentId)
    ? queryDocumentId
    : queryDocumentId[0];

  const [isOpenSaveSnackbar, setIsOpenSaveSnackbar] = useState(false);
  const {
    schema,
    message,
    undoMessage,
    redoMessage,
    setSchema,
    undoSchema,
    redoSchema,
    resetHistory,
  } = useSchemaHistory();

  useEffect(() => {
    if (!authUser) {
      router.push("/");
    }
  }, [authUser, router]);

  const { isLoading, document, exist } = useFirebaseSchema(documentId);

  useEffect(() => {
    if (!isLoading && !exist) {
      router.push("/404");
    }
  }, [exist, isLoading, router]);

  useEffect(() => {
    if (!document) return;
    resetHistory(document?.schema);
  }, [document, resetHistory]);

  if (!authUser) return <></>;
  if (isLoading) {
    return (
      <>
        <Header />
        <div>Loading</div>
        <Footer />
      </>
    );
  }

  const isSameUser = authUser?.id === document?.user.id;

  return (
    <>
      <Header>
        <ButtonGroup size="small" color="inherit" variant="text">
          {undoMessage ? (
            <Tooltip title={message}>
              <Button startIcon={<UndoIcon />} onClick={undoSchema}>
                Undo
              </Button>
            </Tooltip>
          ) : (
            <Button startIcon={<UndoIcon />} disabled>
              Undo
            </Button>
          )}
          {redoMessage ? (
            <Tooltip title={redoMessage}>
              <Button startIcon={<RedoIcon />} onClick={redoSchema}>
                Redo
              </Button>
            </Tooltip>
          ) : (
            <Button startIcon={<RedoIcon />} disabled>
              Redo
            </Button>
          )}
          <Button
            disabled={!isSameUser}
            startIcon={<SaveIcon />}
            onClick={async () => {
              const { errors } = await saveSchema(schema, authUser);
              setIsOpenSaveSnackbar(true);
              if (errors.length !== 0) {
                alert(errors);
              }
            }}
          >
            Save
          </Button>
          <Button
            startIcon={<DeleteOutlineIcon />}
            onClick={() => router.back()}
          >
            Remove
          </Button>
          <Button startIcon={<ExitToAppIcon />} onClick={() => router.back()}>
            Return
          </Button>
        </ButtonGroup>
      </Header>
      <Container>
        <SchemaForm schema={schema} setSchema={setSchema} />
      </Container>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={isOpenSaveSnackbar}
        autoHideDuration={6000}
        onClose={() => setIsOpenSaveSnackbar(false)}
        message="Schema saved"
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => setIsOpenSaveSnackbar(false)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
      <Footer />
    </>
  );
}

// Use `withAuthUser` to get the authed user server-side, which
// disables static rendering.
// Use `withAuthUserInfo` to include the authed user as a prop
// to your component.
export default withAuthUser(withAuthUserInfo(SchemaEdit));

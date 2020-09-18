import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Container from "@material-ui/core/Container";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import RedoIcon from "@material-ui/icons/Redo";
import SaveIcon from "@material-ui/icons/Save";
import UndoIcon from "@material-ui/icons/Undo";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";

import Footer from "../../src/components/common/footer";
import Header from "../../src/components/common/header";
import LoadingBackdrop from "../../src/components/common/loadingBackdrop";
import ResultSnackbar from "../../src/components/common/resultSnackbar";
import SchemaForm from "../../src/components/schema/forms/schemaForm";
import { AuthUserInfoContext } from "../../src/utils/auth/hooks";
import initFirebase from "../../src/utils/auth/initFirebase";
import {
  ResultSnackbarState,
  SchemaCollection,
} from "../../src/utils/firestore/types";
import useCreateDocument from "../../src/utils/firestore/useCreateDocument";
import useRemoveDocument from "../../src/utils/firestore/useRemoveDocument";
import withAuthUser from "../../src/utils/pageWrappers/withAuthUser";
import withAuthUserInfo from "../../src/utils/pageWrappers/withAuthUserInfo";
import { SchemaDocument } from "../../src/utils/schema/types";
import useSchemaHistory from "../../src/utils/schema/useSchemaHistory";

initFirebase();

function SchemaCreate(): JSX.Element {
  const { authUser } = useContext(AuthUserInfoContext);
  const router = useRouter();

  const {
    schema,
    message,
    undoMessage,
    redoMessage,
    setSchema,
    undoSchema,
    redoSchema,
  } = useSchemaHistory();

  useEffect(() => {
    if (!authUser) {
      router.push("/");
    }
  }, [authUser, router]); // [] = run once

  const [snackbarState, setSnackbarState] = useState<ResultSnackbarState>({
    isOpen: false,
  });

  const { create: createSchema, state: createSchemaState } = useCreateDocument<
    SchemaDocument
  >(SchemaCollection);
  const documentId = createSchemaState?.document?.id;
  useEffect(() => {
    if (createSchemaState.document) {
      setSnackbarState({ isOpen: true, message: "Schema saved" });
    } else if (createSchemaState.errors) {
      setSnackbarState({
        isOpen: true,
        message: `${createSchemaState.errors}`,
      });
    }
  }, [createSchemaState.document, createSchemaState.errors]);

  const { remove: removeSchema, state: removeSchemaState } = useRemoveDocument(
    SchemaCollection,
  );
  useEffect(() => {
    if (removeSchemaState.success) {
      setSnackbarState({ isOpen: true, message: "Schema removed" });
      router.back();
    } else if (removeSchemaState.errors) {
      setSnackbarState({
        isOpen: true,
        message: `${removeSchemaState.errors}`,
      });
    }
  }, [removeSchemaState.errors, removeSchemaState.success, router]);

  if (!authUser) return <></>;

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
            startIcon={<SaveIcon />}
            onClick={async () =>
              createSchema({
                user: authUser,
                schema,
                stars: 0,
                created: new Date().toJSON(),
              })
            }
          >
            Save
          </Button>
          <Button
            disabled={!documentId}
            startIcon={<DeleteOutlineIcon />}
            onClick={() => {
              if (documentId) {
                removeSchema(documentId);
              }
            }}
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
      <ResultSnackbar state={snackbarState} setState={setSnackbarState} />
      <LoadingBackdrop
        isLoading={removeSchemaState.isLoading || createSchemaState.isLoading}
      />
      <Footer />
    </>
  );
}

// Use `withAuthUser` to get the authed user server-side, which
// disables static rendering.
// Use `withAuthUserInfo` to include the authed user as a prop
// to your component.
export default withAuthUser(withAuthUserInfo(SchemaCreate));

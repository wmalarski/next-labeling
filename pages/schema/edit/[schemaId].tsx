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

import Footer from "../../../components/common/footer";
import Header from "../../../components/common/header";
import LoadingBackdrop from "../../../components/common/loadingBackdrop";
import ResultSnackbar from "../../../components/common/resultSnackbar";
import SchemaForm from "../../../components/schema/forms/schemaForm";
import { AuthUserInfoContext } from "../../../utils/auth/hooks";
import initFirebase from "../../../utils/auth/initFirebase";
import {
  ResultSnackbarState,
  SchemaCollection,
} from "../../../utils/firestore/types";
import useRemoveDocument from "../../../utils/firestore/useRemoveDocument";
import useUpdateDocument from "../../../utils/firestore/useUpdateLabeling";
import withAuthUser from "../../../utils/pageWrappers/withAuthUser";
import withAuthUserInfo from "../../../utils/pageWrappers/withAuthUserInfo";
import { SchemaDocument } from "../../../utils/schema/types";
import useFetchSchema from "../../../utils/schema/useFetchSchema";
import useSchemaHistory from "../../../utils/schema/useSchemaHistory";

initFirebase();

function SchemaEdit(): JSX.Element {
  const { authUser } = useContext(AuthUserInfoContext);

  const router = useRouter();
  const { schemaId: queryDocumentId } = router.query;
  const documentId = !Array.isArray(queryDocumentId)
    ? queryDocumentId
    : queryDocumentId[0];

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

  const { isLoading, document, exist } = useFetchSchema(documentId);
  const { update: updateSchema, state: updateSchemaState } = useUpdateDocument<
    SchemaDocument
  >(SchemaCollection);

  useEffect(() => {
    if (!isLoading && !exist) {
      router.push("/404");
    }
  }, [exist, isLoading, router]);

  useEffect(() => {
    if (!document) return;
    resetHistory(document?.schema);
  }, [document, resetHistory]);

  const [snackbarState, setSnackbarState] = useState<ResultSnackbarState>({
    isOpen: false,
  });

  useEffect(() => {
    if (updateSchemaState.document) {
      setSnackbarState({ isOpen: true, message: "Schema saved" });
    } else if (updateSchemaState.errors) {
      setSnackbarState({
        isOpen: true,
        message: `${updateSchemaState.errors}`,
      });
    }
  }, [updateSchemaState.document, updateSchemaState.errors]);

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
            onClick={() => {
              if (document) {
                updateSchema(documentId, { ...document, schema });
              }
            }}
          >
            Save
          </Button>
          <Button
            startIcon={<DeleteOutlineIcon />}
            onClick={() => {
              removeSchema(documentId);
              router.back();
            }}
          >
            Remove
          </Button>
          <Button startIcon={<ExitToAppIcon />} onClick={() => router.back()}>
            Return
          </Button>
        </ButtonGroup>
      </Header>
      {!isLoading && (
        <Container>
          <SchemaForm schema={schema} setSchema={setSchema} />
        </Container>
      )}
      <ResultSnackbar state={snackbarState} setState={setSnackbarState} />
      <LoadingBackdrop
        isLoading={
          isLoading ||
          removeSchemaState.isLoading ||
          updateSchemaState.isLoading
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

import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Container from "@material-ui/core/Container";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import RedoIcon from "@material-ui/icons/Redo";
import SaveIcon from "@material-ui/icons/Save";
import UndoIcon from "@material-ui/icons/Undo";
import firebase from "firebase/app";
import "firebase/firestore";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import withToken from "../../auth/functions/withToken";
import useAuth from "../../auth/hooks/useAuth";
import Footer from "../../common/components/footer";
import Header from "../../common/components/header";
import LoadingBackdrop from "../../common/components/loadingBackdrop";
import useRouterRemove from "../../common/hooks/useRouterRemove";
import useSnackbar from "../../common/hooks/useSnackbar";
import { initializeFirebase } from "../../firebase/firebaseClient";
import useCreateDocument from "../../firebase/hooks/useCreateDocument";
import { SchemaCollection } from "../../firebase/types";
import SchemaForm from "../../schema/components/forms/schemaForm";
import useSchemaHistory from "../../schema/hooks/useSchemaHistory";
import { SchemaDocument } from "../../schema/types";

initializeFirebase();

export default function SchemaCreate(): JSX.Element {
  const { authUser } = useAuth();
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
  }, [authUser, router]);

  const { showSnackbar } = useSnackbar();

  const collection = firebase.firestore().collection(SchemaCollection);
  const {
    create: createSchema,
    state: createSchemaState,
  } = useCreateDocument<SchemaDocument>(collection);
  const documentId = createSchemaState?.id;
  useEffect(() => {
    if (createSchemaState.document) {
      showSnackbar({ isOpen: true, message: "Schema saved" });
    } else if (createSchemaState.errors) {
      showSnackbar({
        isOpen: true,
        message: `${createSchemaState.errors}`,
      });
    }
  }, [showSnackbar, createSchemaState.document, createSchemaState.errors]);

  const { remove, isLoading: isRemoveLoading } = useRouterRemove({
    collection,
    backOnSuccess: true,
    setSnackbarState: showSnackbar,
  });

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
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                editedAt: firebase.firestore.FieldValue.serverTimestamp(),
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
                remove(documentId);
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
      <LoadingBackdrop
        isLoading={isRemoveLoading || createSchemaState.isLoading}
      />
      <Footer />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = withToken({
  redirect: true,
});

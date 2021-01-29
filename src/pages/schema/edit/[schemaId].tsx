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
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAuthUserInfo } from "../../../auth/hooks";
import initFirebase from "../../../auth/initFirebase";
import Footer from "../../../common/components/footer";
import Header from "../../../common/components/header";
import LoadingBackdrop from "../../../common/components/loadingBackdrop";
import ResultSnackbar from "../../../common/components/resultSnackbar";
import useRouterRemove from "../../../common/hooks/useRouterRemove";
import withAuthUser from "../../../common/wrappers/withAuthUser";
import withAuthUserInfo from "../../../common/wrappers/withAuthUserInfo";
import {
  ResultSnackbarState,
  SchemaCollection,
} from "../../../firestore/types";
import SchemaForm from "../../../schema/components/forms/schemaForm";
import useFetchSchema from "../../../schema/hooks/useFetchSchema";
import useSchemaHistory from "../../../schema/hooks/useSchemaHistory";
import useUpdateSchema from "../../../schema/hooks/useUpdateSchema";

initFirebase();

export interface SchemaEditProps {
  documentId: string;
}

function SchemaEdit(props: SchemaEditProps): JSX.Element {
  const { documentId } = props;

  const { authUser } = useAuthUserInfo();

  const router = useRouter();

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

  const [snackbarState, setSnackbarState] = useState<ResultSnackbarState>({
    isOpen: false,
  });

  const { isLoading, document, exist } = useFetchSchema(documentId);

  useEffect(() => {
    if (!isLoading && !exist) {
      router.push("/404");
    }
  }, [exist, isLoading, router]);

  useEffect(() => {
    if (!document) return;
    resetHistory(document?.schema);
  }, [document, resetHistory]);

  const { update: updateSchema, state: updateSchemaState } = useUpdateSchema();
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

  const collection = firebase.firestore().collection(SchemaCollection);
  const { remove, isLoading: isRemoveLoading } = useRouterRemove({
    collection,
    backOnSuccess: true,
    setSnackbarState,
  });

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
                updateSchema(documentId, { schema });
              }
            }}
          >
            Save
          </Button>
          <Button
            startIcon={<DeleteOutlineIcon />}
            onClick={() => {
              remove(documentId);
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
        isLoading={isLoading || isRemoveLoading || updateSchemaState.isLoading}
      />
      <Footer />
    </>
  );
}

export default withAuthUser(withAuthUserInfo(SchemaEdit));

export const getStaticProps: GetStaticProps<SchemaEditProps> = async ({
  params,
}) => {
  const documentId = Array.isArray(params?.projectId)
    ? undefined
    : params?.projectId;

  if (!documentId) return { notFound: true };

  return { props: { documentId } };
};

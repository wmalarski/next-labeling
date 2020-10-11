import "firebase/firestore";

import Button from "@material-ui/core/Button";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import EditIcon from "@material-ui/icons/Edit";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import SaveAltIcon from "@material-ui/icons/SaveAlt";
import firebase from "firebase/app";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";

import Footer from "../../components/common/footer";
import Header from "../../components/common/header";
import LoadingBackdrop from "../../components/common/loadingBackdrop";
import ResultSnackbar from "../../components/common/resultSnackbar";
import CreateLabelingDialog from "../../components/labeling/createLabelingDialog";
import withAuthUser from "../../components/pageWrappers/withAuthUser";
import withAuthUserInfo from "../../components/pageWrappers/withAuthUserInfo";
import SchemaDetails from "../../components/schema/details/schemaDetails";
import RawForm from "../../components/schema/forms/rawForm";
import { AuthUserInfoContext } from "../../utils/auth/hooks";
import initFirebase from "../../utils/auth/initFirebase";
import {
  ResultSnackbarState,
  SchemaCollection,
} from "../../utils/firestore/types";
import useCreate from "../../utils/firestore/useCreate";
import useRemoveDocument from "../../utils/firestore/useRemoveDocument";
import { SchemaDocument } from "../../utils/schema/types";
import useFetchSchema from "../../utils/schema/useFetchSchema";

initFirebase();

function SchemaDetailsPage(): JSX.Element {
  const { authUser } = useContext(AuthUserInfoContext);

  const router = useRouter();
  const { schemaId: queryDocumentId } = router.query;
  const documentId = !Array.isArray(queryDocumentId)
    ? queryDocumentId
    : queryDocumentId[0];

  useEffect(() => {
    if (!authUser) {
      router.push("/");
    }
  }, [authUser, router]);

  const { isLoading, document, exist } = useFetchSchema(documentId);

  useEffect(() => {
    if (!isLoading && !exist) {
      router.push("/404");
    }
  }, [exist, isLoading, router]);

  const [snackbarState, setSnackbarState] = useState<ResultSnackbarState>({
    isOpen: false,
  });

  const db = firebase.firestore();
  const collection = db.collection(SchemaCollection);
  const createSchema = useCreate<SchemaDocument>({
    collection,
    setSnackbarState: setSnackbarState,
    routerOptions: doc => ({
      url: "/schema/[schemaId]",
      as: `/schema/${doc.id}`,
    }),
  });

  const { remove: removeSchema, state: removeSchemaState } = useRemoveDocument(
    collection,
  );
  useEffect(() => {
    if (removeSchemaState.success) {
      router.back();
    } else if (removeSchemaState.errors) {
      setSnackbarState({
        isOpen: true,
        message: `${removeSchemaState.errors}`,
      });
    }
  }, [removeSchemaState.errors, removeSchemaState.success, router]);

  if (!authUser) return <></>;
  const isSameUser = authUser.id === document?.user.id;

  return (
    <>
      <Header>
        {!isLoading && document ? (
          <>
            <CreateLabelingDialog schema={document} />
            {isSameUser ? (
              <Button
                size="small"
                color="inherit"
                startIcon={<EditIcon />}
                onClick={() =>
                  router.push(
                    "/schema/edit/[schemaId]",
                    `/schema/edit/${documentId}`,
                  )
                }
              >
                Edit
              </Button>
            ) : (
              <></>
            )}
            <RawForm
              startIcon={<SaveAltIcon />}
              label="Export"
              schema={document.schema}
            />
            <Button
              size="small"
              color="inherit"
              startIcon={<FileCopyIcon />}
              onClick={() =>
                createSchema.create({
                  user: authUser,
                  schema: document.schema,
                  stars: 0,
                  created: new Date().toJSON(),
                })
              }
            >
              Copy
            </Button>
            {isSameUser ? (
              <Button
                size="small"
                color="inherit"
                startIcon={<DeleteOutlineIcon />}
                onClick={() => {
                  removeSchema(documentId);
                }}
              >
                Remove
              </Button>
            ) : (
              <></>
            )}
            <Button
              size="small"
              color="inherit"
              startIcon={<ExitToAppIcon />}
              onClick={() => router.back()}
            >
              Return
            </Button>
          </>
        ) : (
          <></>
        )}
      </Header>
      {document ? <SchemaDetails schemaDocument={document} /> : <></>}
      <ResultSnackbar state={snackbarState} setState={setSnackbarState} />
      <LoadingBackdrop
        isLoading={
          isLoading || removeSchemaState.isLoading || createSchema.isLoading
        }
      />
      <Footer />
    </>
  );
}

export default withAuthUser(withAuthUserInfo(SchemaDetailsPage));

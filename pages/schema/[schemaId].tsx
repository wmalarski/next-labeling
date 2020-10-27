import "firebase/firestore";

import Button from "@material-ui/core/Button";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import EditIcon from "@material-ui/icons/Edit";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import SaveAltIcon from "@material-ui/icons/SaveAlt";
import firebase from "firebase/app";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import Footer from "../../components/common/footer";
import Header from "../../components/common/header";
import LoadingBackdrop from "../../components/common/loadingBackdrop";
import ResultSnackbar from "../../components/common/resultSnackbar";
import CreateLabelingDialog from "../../components/labeling/createLabelingDialog";
import withAuthUser from "../../components/pageWrappers/withAuthUser";
import withAuthUserInfo from "../../components/pageWrappers/withAuthUserInfo";
import SchemaDetails from "../../components/schema/details/schemaDetails";
import RawForm from "../../components/schema/forms/rawForm";
import { useAuthUserInfo } from "../../utils/auth/hooks";
import initFirebase from "../../utils/auth/initFirebase";
import useRouterCreate from "../../utils/common/useRouterCreate";
import useRouterRemove from "../../utils/common/useRouterRemove";
import {
  ResultSnackbarState,
  SchemaCollection,
} from "../../utils/firestore/types";
import { SchemaDocument } from "../../utils/schema/types";
import useFetchSchema from "../../utils/schema/useFetchSchema";

initFirebase();

function SchemaDetailsPage(): JSX.Element {
  const { authUser } = useAuthUserInfo();

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

  const collection = firebase.firestore().collection(SchemaCollection);
  const createSchema = useRouterCreate<SchemaDocument>({
    collection,
    setSnackbarState: setSnackbarState,
    routerOptions: (_schema, id) => ({
      url: "/schema/[schemaId]",
      as: `/schema/${id}`,
    }),
  });
  const { remove, isLoading: isRemoveLoading } = useRouterRemove({
    collection,
    backOnSuccess: true,
    setSnackbarState,
  });

  if (!authUser) return <></>;
  const isSameUser = authUser.id === document?.user.id;

  return (
    <>
      <Header>
        {!isLoading && document ? (
          <>
            <CreateLabelingDialog schemaId={documentId} schema={document} />
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
                  createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                  editedAt: firebase.firestore.FieldValue.serverTimestamp(),
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
                  remove(documentId);
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
        isLoading={isLoading || isRemoveLoading || createSchema.isLoading}
      />
      <Footer />
    </>
  );
}

export default withAuthUser(withAuthUserInfo(SchemaDetailsPage));

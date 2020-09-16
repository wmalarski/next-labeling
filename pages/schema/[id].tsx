import "firebase/firestore";

import Button from "@material-ui/core/Button";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import EditIcon from "@material-ui/icons/Edit";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import SaveAltIcon from "@material-ui/icons/SaveAlt";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";

import Footer from "../../src/components/common/footer";
import Header from "../../src/components/common/header";
import SchemaDetails from "../../src/components/schema/details/schemaDetails";
import RawForm from "../../src/components/schema/forms/rawForm";
import { AuthUserInfoContext } from "../../src/utils/auth/hooks";
import initFirebase from "../../src/utils/auth/initFirebase";
import withAuthUser from "../../src/utils/pageWrappers/withAuthUser";
import withAuthUserInfo from "../../src/utils/pageWrappers/withAuthUserInfo";
import useFetchSchema from "../../src/utils/schema/useFetchSchema";
import ResultSnackbar, {
  ResultSnackbarState,
} from "../../src/components/common/resultSnackbar";
import useRemoveSchema from "../../src/utils/schema/useRemoveSchema";

initFirebase();

function SchemaDetailsPage(): JSX.Element {
  const { authUser } = useContext(AuthUserInfoContext);

  const router = useRouter();
  const { id: queryDocumentId } = router.query;
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

  const { remove: removeSchema, state: removeSchemaState } = useRemoveSchema();
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
  if (isLoading) {
    return (
      <>
        <Header />
        <div>Loading</div>
        <Footer />
      </>
    );
  }
  const isSameUser = authUser.id === document?.user.id;

  return (
    <>
      <Header>
        {document ? (
          <>
            {isSameUser ? (
              <Button
                size="small"
                color="inherit"
                startIcon={<EditIcon />}
                onClick={() =>
                  router.push("/schema/edit/[id]", `/schema/edit/${documentId}`)
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
              onClick={() => {
                // TODO: add copy handler
              }}
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
      <Footer />
    </>
  );
}

export default withAuthUser(withAuthUserInfo(SchemaDetailsPage));

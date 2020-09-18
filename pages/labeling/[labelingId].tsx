import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Container from "@material-ui/core/Container";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import SaveIcon from "@material-ui/icons/Save";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";

import Footer from "../../src/components/common/footer";
import Header from "../../src/components/common/header";
import LoadingBackdrop from "../../src/components/common/loadingBackdrop";
import ResultSnackbar from "../../src/components/common/resultSnackbar";
import LabelingWorkspace from "../../src/components/labeling/labelingWorkspace";
import FramesProvider from "../../src/contexts/frames/framesProvider";
import LabelingProvider from "../../src/contexts/labeling/labelingProvider";
import SelectionProvider from "../../src/contexts/selection/selectionProvider";
import { AuthUserInfoContext } from "../../src/utils/auth/hooks";
import initFirebase from "../../src/utils/auth/initFirebase";
import {
  LabelingCollection,
  ResultSnackbarState,
} from "../../src/utils/firestore/types";
import useRemoveDocument from "../../src/utils/firestore/useRemoveDocument";
import useUpdateDocument from "../../src/utils/firestore/useUpdateLabeling";
import { LabelingDocument } from "../../src/utils/labeling/types";
import useFetchLabeling from "../../src/utils/labeling/useFetchLabeling";
import withAuthUser from "../../src/utils/pageWrappers/withAuthUser";
import withAuthUserInfo from "../../src/utils/pageWrappers/withAuthUserInfo";

initFirebase();

function LabelingEditor(): JSX.Element {
  const { authUser } = useContext(AuthUserInfoContext);

  const router = useRouter();
  const { labelingId: queryDocumentId } = router.query;
  const documentId = !Array.isArray(queryDocumentId)
    ? queryDocumentId
    : queryDocumentId[0];

  useEffect(() => {
    if (!authUser) {
      router.push("/");
    }
  }, [authUser, router]);

  const { isLoading, document, exist } = useFetchLabeling(documentId);

  useEffect(() => {
    if (!isLoading && !exist) {
      router.push("/404");
    }
  }, [exist, isLoading, router]);

  const [snackbarState, setSnackbarState] = useState<ResultSnackbarState>({
    isOpen: false,
  });

  const { update: updateLabeling, state: updateState } = useUpdateDocument<
    LabelingDocument
  >(LabelingCollection);
  useEffect(() => {
    if (updateState.document) {
      setSnackbarState({ isOpen: true, message: "Schema saved" });
    } else if (updateState.errors) {
      setSnackbarState({
        isOpen: true,
        message: `${updateState.errors}`,
      });
    }
  }, [updateState.document, updateState.errors]);

  const { remove: removeSchema, state: removeState } = useRemoveDocument(
    LabelingCollection,
  );
  useEffect(() => {
    if (removeState.success) {
      setSnackbarState({ isOpen: true, message: "Schema removed" });
      router.back();
    } else if (removeState.errors) {
      setSnackbarState({
        isOpen: true,
        message: `${removeState.errors}`,
      });
    }
  }, [removeState.errors, removeState.success, router]);

  if (!authUser) return <></>;
  const isSameUser = authUser?.id === document?.user.id;

  return (
    <>
      {document && (
        <FramesProvider>
          <SelectionProvider>
            <LabelingProvider document={document}>
              <Header>
                <ButtonGroup size="small" color="inherit" variant="text">
                  <Button
                    disabled={!isSameUser}
                    startIcon={<SaveIcon />}
                    onClick={() => {
                      if (document) {
                        // updateLabeling(documentId, { ...document, schema });
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
                  <Button
                    startIcon={<ExitToAppIcon />}
                    onClick={() => router.back()}
                  >
                    Return
                  </Button>
                </ButtonGroup>
              </Header>
              {!isLoading && (
                <Container>
                  <LabelingWorkspace />
                </Container>
              )}
              <ResultSnackbar
                state={snackbarState}
                setState={setSnackbarState}
              />
              <LoadingBackdrop
                isLoading={
                  isLoading || removeState.isLoading || updateState.isLoading
                }
              />
              <Footer />
            </LabelingProvider>
          </SelectionProvider>
        </FramesProvider>
      )}
    </>
  );
}

// Use `withAuthUser` to get the authed user server-side, which
// disables static rendering.
// Use `withAuthUserInfo` to include the authed user as a prop
// to your component.
export default withAuthUser(withAuthUserInfo(LabelingEditor));

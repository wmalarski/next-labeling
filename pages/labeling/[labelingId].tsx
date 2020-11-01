import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Footer from "../../components/common/footer";
import Header from "../../components/common/header";
import LoadingBackdrop from "../../components/common/loadingBackdrop";
import ResultSnackbar from "../../components/common/resultSnackbar";
import EditorHeader from "../../components/labeling/editorHeader";
import EditorSidebar from "../../components/labeling/editorSidebar";
import LabelingProvider from "../../components/labeling/labelingProvider";
import LabelingWorkspace from "../../components/labeling/labelingWorkspace";
import PreferencesProvider from "../../components/labeling/preferencesProvider";
import withAuthUser from "../../components/pageWrappers/withAuthUser";
import withAuthUserInfo from "../../components/pageWrappers/withAuthUserInfo";
import ToolProvider from "../../components/visualization/toolProvider";
import { useAuthUserInfo } from "../../utils/auth/hooks";
import initFirebase from "../../utils/auth/initFirebase";
import { ResultSnackbarState } from "../../utils/firestore/types";
import useFetchLabeling from "../../utils/labeling/hooks/useFetchLabeling";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    toolbar: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
  }),
);

initFirebase();

function LabelingEditor(): JSX.Element {
  const classes = useStyles();

  const { authUser } = useAuthUserInfo();

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

  if (!authUser) return <></>;

  return (
    <>
      {document && (
        <ToolProvider>
          <LabelingProvider
            documentId={documentId}
            document={document}
            setSnackbarState={setSnackbarState}
          >
            <PreferencesProvider>
              <div className={classes.root}>
                <Header>
                  <EditorHeader />
                </Header>
                <EditorSidebar />
                {!isLoading && (
                  <div className={classes.content}>
                    <div className={classes.toolbar} />
                    <LabelingWorkspace documentId={documentId} />
                  </div>
                )}
              </div>

              <ResultSnackbar
                state={snackbarState}
                setState={setSnackbarState}
              />
              <LoadingBackdrop isLoading={isLoading} />
              <Footer />
            </PreferencesProvider>
          </LabelingProvider>
        </ToolProvider>
      )}
    </>
  );
}

// Use `withAuthUser` to get the authed user server-side, which
// disables static rendering.
// Use `withAuthUserInfo` to include the authed user as a prop
// to your component.
export default withAuthUser(withAuthUserInfo(LabelingEditor));

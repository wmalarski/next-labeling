import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";

import Footer from "../../src/components/common/footer";
import Header from "../../src/components/common/header";
import LoadingBackdrop from "../../src/components/common/loadingBackdrop";
import ResultSnackbar from "../../src/components/common/resultSnackbar";
import LabelingWorkspace from "../../src/components/labeling/labelingWorkspace";
import EditorSidebar from "../../src/components/labeling/sidebar/editorSidebar";
import FramesProvider from "../../src/contexts/frames/framesProvider";
import LabelingProvider from "../../src/contexts/labeling/labelingProvider";
import SelectionProvider from "../../src/contexts/selection/selectionProvider";
import { AuthUserInfoContext } from "../../src/utils/auth/hooks";
import initFirebase from "../../src/utils/auth/initFirebase";
import { ResultSnackbarState } from "../../src/utils/firestore/types";
import useFetchLabeling from "../../src/utils/labeling/useFetchLabeling";
import withAuthUser from "../../src/utils/pageWrappers/withAuthUser";
import withAuthUserInfo from "../../src/utils/pageWrappers/withAuthUserInfo";

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

  if (!authUser) return <></>;

  return (
    <>
      {document && (
        <FramesProvider>
          <SelectionProvider>
            <LabelingProvider
              document={document}
              setSnackbarState={setSnackbarState}
            >
              <div className={classes.root}>
                <Header />
                <EditorSidebar />
                {!isLoading && (
                  <div className={classes.content}>
                    <div className={classes.toolbar} />
                    <LabelingWorkspace />
                  </div>
                )}
              </div>
              <ResultSnackbar
                state={snackbarState}
                setState={setSnackbarState}
              />
              <LoadingBackdrop isLoading={isLoading} />

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

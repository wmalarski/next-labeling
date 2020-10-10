import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { RemoveScrollBar } from "react-remove-scroll-bar";

import Header from "../../src/components/common/header";
import LoadingBackdrop from "../../src/components/common/loadingBackdrop";
import ResultSnackbar from "../../src/components/common/resultSnackbar";
import EditorTable from "../../src/components/editors/editorTable";
import EditorHeader from "../../src/components/labeling/editorHeader";
import EditorSidebar from "../../src/components/labeling/editorSidebar";
import FrameSlider from "../../src/components/labeling/frameSlider";
import LabelingProvider from "../../src/components/labeling/labelingProvider";
import LabelingWorkspace from "../../src/components/labeling/labelingWorkspace";
import PreferencesProvider from "../../src/components/labeling/preferencesProvider";
import TimelineView from "../../src/components/timeline/timelineView";
import ToolProvider from "../../src/components/visualization/toolProvider";
import { AuthUserInfoContext } from "../../src/utils/auth/hooks";
import initFirebase from "../../src/utils/auth/initFirebase";
import { ResultSnackbarState } from "../../src/utils/firestore/types";
import useFetchLabeling from "../../src/utils/labeling/hooks/useFetchLabeling";
import { LabelingViewsState } from "../../src/utils/labeling/views";
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

  const [viewsState, setViewsState] = useState<LabelingViewsState>({
    properties: true,
    timeline: true,
  });

  if (!authUser) return <></>;

  return (
    <>
      {document && (
        <ToolProvider>
          <LabelingProvider
            document={document}
            setSnackbarState={setSnackbarState}
          >
            <PreferencesProvider>
              <RemoveScrollBar />
              <div className={classes.root}>
                <Header>
                  <EditorHeader />
                </Header>
                <EditorSidebar
                  viewsState={viewsState}
                  setViewsState={setViewsState}
                />
                {!isLoading && (
                  <div className={classes.content}>
                    <div className={classes.toolbar} />
                    <div
                      style={{
                        display: "flex",
                        flexFlow: "column",
                      }}
                    >
                      <div
                        style={{
                          display: "flex", // TODO: fix sizes #3
                          flexFlow: "row",
                          flexGrow: 1,
                        }}
                      >
                        <div style={{ flexGrow: 1 }}>
                          <LabelingWorkspace />
                        </div>
                        <div style={{ overflow: "auto", height: 400 }}>
                          {viewsState.properties && <EditorTable />}
                        </div>
                      </div>
                      <div
                        style={{ overflow: "auto", height: 100, flexGrow: 1 }}
                      >
                        {viewsState.timeline && <TimelineView />}
                      </div>
                      <FrameSlider />
                    </div>
                  </div>
                )}
              </div>

              <ResultSnackbar
                state={snackbarState}
                setState={setSnackbarState}
              />
              <LoadingBackdrop isLoading={isLoading} />

              {/* <Footer /> */}
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

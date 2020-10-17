import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { RemoveScrollBar } from "react-remove-scroll-bar";

import CommentChat from "../../components/comments/commentChat";
import Header from "../../components/common/header";
import LoadingBackdrop from "../../components/common/loadingBackdrop";
import ResultSnackbar from "../../components/common/resultSnackbar";
import EditorTable from "../../components/editors/editorTable";
import EditorHeader from "../../components/labeling/editorHeader";
import EditorSidebar from "../../components/labeling/editorSidebar";
import FrameSlider from "../../components/labeling/frameSlider";
import LabelingProvider from "../../components/labeling/labelingProvider";
import LabelingWorkspace from "../../components/labeling/labelingWorkspace";
import PreferencesProvider from "../../components/labeling/preferencesProvider";
import withAuthUser from "../../components/pageWrappers/withAuthUser";
import withAuthUserInfo from "../../components/pageWrappers/withAuthUserInfo";
import TimelineView from "../../components/timeline/timelineView";
import ToolProvider from "../../components/visualization/toolProvider";
import { useAuthUserInfo } from "../../utils/auth/hooks";
import initFirebase from "../../utils/auth/initFirebase";
import { ResultSnackbarState } from "../../utils/firestore/types";
import useFetchLabeling from "../../utils/labeling/hooks/useFetchLabeling";
import { LabelingViewsState } from "../../utils/labeling/views";

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

  const [viewsState, setViewsState] = useState<LabelingViewsState>({
    properties: true,
    timeline: true,
    comments: true,
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
                        <div style={{ overflow: "auto", height: 400 }}>
                          {viewsState.comments && (
                            <CommentChat documentId={documentId} />
                          )}
                        </div>
                      </div>
                      <div
                        style={{ overflow: "auto", height: 200, flexGrow: 1 }}
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

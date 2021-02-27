import { useRouter } from "next/router";
import React, { useEffect } from "react";
import Footer from "../../common/components/footer";
import Header from "../../common/components/header";
import LoadingBackdrop from "../../common/components/loadingBackdrop";
import useSnackbar from "../../common/hooks/useSnackbar";
import { useRootDispatch } from "../../common/redux/store";
import EditorHeader from "../../toolbars/components/editorHeader";
import EditorSidebar from "../../toolbars/components/editorSidebar";
import LabelingWorkspace from "../../workspace/components/labelingWorkspace";
import useFetchLabeling from "../../workspace/hooks/useFetchLabeling";
import { useLabelingEditorStyles } from "../../workspace/styles";
import { resetLabeling } from "../redux/slice";
import LabelingProvider from "./labelingProvider";

export interface WorkspacePageProps {
  documentId: string;
}

export default function WorkspacePage(props: WorkspacePageProps): JSX.Element {
  const { documentId } = props;
  const classes = useLabelingEditorStyles();

  const router = useRouter();

  const { isLoading, document, exist } = useFetchLabeling(documentId);

  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    if (!isLoading && !exist) router.push("/404");
  }, [exist, isLoading, router]);

  const dispatch = useRootDispatch();
  useEffect(() => {
    if (!document) return;
    dispatch(resetLabeling(document));
  }, [dispatch, document]);

  return (
    <LabelingProvider documentId={documentId} setSnackbarState={showSnackbar}>
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
      <LoadingBackdrop isLoading={isLoading} />
      <Footer />
    </LabelingProvider>
  );
}

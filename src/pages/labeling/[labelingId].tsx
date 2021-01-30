import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import withToken from "../../auth/functions/withToken";
import Footer from "../../common/components/footer";
import Header from "../../common/components/header";
import LoadingBackdrop from "../../common/components/loadingBackdrop";
import useSnackbar from "../../common/hooks/useSnackbar";
import { initializeFirebase } from "../../firebase/firebaseClient";
import LabelingProvider from "../../workspace/components/labelingProvider";
import LabelingWorkspace from "../../workspace/components/labelingWorkspace";
import PreferencesProvider from "../../workspace/components/preferences/preferencesProvider";
import EditorHeader from "../../workspace/components/toolbars/editorHeader";
import EditorSidebar from "../../workspace/components/toolbars/editorSidebar";
import ToolProvider from "../../workspace/components/toolbars/toolProvider";
import useFetchLabeling from "../../workspace/hooks/useFetchLabeling";
import { useLabelingEditorStyles } from "../../workspace/styles";

initializeFirebase();

export interface LabelingEditorProps {
  documentId: string;
}

export default function LabelingEditor(
  props: LabelingEditorProps,
): JSX.Element {
  const { documentId } = props;
  const classes = useLabelingEditorStyles();

  const router = useRouter();

  const { isLoading, document, exist } = useFetchLabeling(documentId);

  useEffect(() => {
    if (!isLoading && !exist) router.push("/404");
  }, [exist, isLoading, router]);

  const { showSnackbar } = useSnackbar();

  return (
    <>
      {document && (
        <ToolProvider>
          <LabelingProvider
            documentId={documentId}
            document={document}
            setSnackbarState={showSnackbar}
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
              <LoadingBackdrop isLoading={isLoading} />
              <Footer />
            </PreferencesProvider>
          </LabelingProvider>
        </ToolProvider>
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = withToken({
  redirect: true,
  getter: async ({ params }) => {
    const documentId = Array.isArray(params?.labelingId)
      ? undefined
      : params?.labelingId;

    if (!documentId) return { notFound: true };

    return { props: { documentId } };
  },
});

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAuthUserInfo } from "../../auth/hooks";
import initFirebase from "../../auth/initFirebase";
import Footer from "../../common/components/footer";
import Header from "../../common/components/header";
import LoadingBackdrop from "../../common/components/loadingBackdrop";
import ResultSnackbar from "../../common/components/resultSnackbar";
import withAuthUser from "../../common/wrappers/withAuthUser";
import withAuthUserInfo from "../../common/wrappers/withAuthUserInfo";
import { ResultSnackbarState } from "../../firestore/types";
import useFetchLabeling from "../../labeling/hooks/useFetchLabeling";
import LabelingProvider from "../../workspace/components/labelingProvider";
import LabelingWorkspace from "../../workspace/components/labelingWorkspace";
import PreferencesProvider from "../../workspace/components/preferences/preferencesProvider";
import EditorHeader from "../../workspace/components/toolbars/editorHeader";
import EditorSidebar from "../../workspace/components/toolbars/editorSidebar";
import ToolProvider from "../../workspace/components/toolbars/toolProvider";

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

export interface LabelingEditorProps {
  documentId: string;
}

function LabelingEditor(props: LabelingEditorProps): JSX.Element {
  const { documentId } = props;
  const classes = useStyles();

  const { authUser } = useAuthUserInfo();

  const router = useRouter();

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

export const getStaticProps: GetStaticProps<LabelingEditorProps> = async ({
  params,
}) => {
  const documentId = Array.isArray(params?.labelingId)
    ? undefined
    : params?.labelingId;

  if (!documentId) return { notFound: true };

  return { props: { documentId } };
};

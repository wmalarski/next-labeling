import { GetServerSideProps } from "next";
import React from "react";
import { Provider } from "react-redux";
import withToken from "../../auth/functions/withToken";
import store from "../../common/redux/store";
import { initializeFirebase } from "../../firebase/firebaseClient";
import WorkspacePage from "../../workspace/components/workspacePage";

initializeFirebase();

export interface LabelingEditorProps {
  documentId: string;
}

export default function LabelingEditor(
  props: LabelingEditorProps,
): JSX.Element {
  const { documentId } = props;

  return (
    <Provider store={store}>
      {documentId && <WorkspacePage documentId={documentId} />}
    </Provider>
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

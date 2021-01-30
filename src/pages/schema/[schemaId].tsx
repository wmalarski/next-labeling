import Button from "@material-ui/core/Button";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import EditIcon from "@material-ui/icons/Edit";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import SaveAltIcon from "@material-ui/icons/SaveAlt";
import firebase from "firebase/app";
import "firebase/firestore";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import withToken from "../../auth/functions/withToken";
import useAuth from "../../auth/hooks/useAuth";
import Footer from "../../common/components/footer";
import Header from "../../common/components/header";
import LoadingBackdrop from "../../common/components/loadingBackdrop";
import useRouterCreate from "../../common/hooks/useRouterCreate";
import useRouterRemove from "../../common/hooks/useRouterRemove";
import useSnackbar from "../../common/hooks/useSnackbar";
import { initializeFirebase } from "../../firebase/firebaseClient";
import { SchemaCollection } from "../../firebase/types";
import CreateLabelingDialog from "../../labeling/components/createLabelingDialog";
import SchemaDetails from "../../schema/components/details/schemaDetails";
import RawForm from "../../schema/components/forms/rawForm";
import useFetchSchema from "../../schema/hooks/useFetchSchema";
import { SchemaDocument } from "../../schema/types";

initializeFirebase();

export interface SchemaDetailsPageProps {
  documentId: string;
  userId: string;
}

export default function SchemaDetailsPage(
  props: SchemaDetailsPageProps,
): JSX.Element {
  const { documentId, userId } = props;

  const { authUser } = useAuth();

  const router = useRouter();

  const { isLoading, document, exist } = useFetchSchema(documentId);

  useEffect(() => {
    if (!isLoading && !exist) {
      router.push("/404");
    }
  }, [exist, isLoading, router]);

  const { showSnackbar } = useSnackbar();

  const collection = firebase.firestore().collection(SchemaCollection);
  const createSchema = useRouterCreate<SchemaDocument>({
    collection,
    setSnackbarState: showSnackbar,
    routerOptions: (_schema, id) => ({
      url: "/schema/[schemaId]",
      as: `/schema/${id}`,
    }),
  });
  const { remove, isLoading: isRemoveLoading } = useRouterRemove({
    collection,
    backOnSuccess: true,
    setSnackbarState: showSnackbar,
  });

  if (!authUser) return <></>;
  const isSameUser = userId === document?.user.id;

  return (
    <>
      <Header>
        {!isLoading && document ? (
          <>
            <CreateLabelingDialog schemaId={documentId} schema={document} />
            {isSameUser ? (
              <Button
                size="small"
                color="inherit"
                startIcon={<EditIcon />}
                onClick={() =>
                  router.push(
                    "/schema/edit/[schemaId]",
                    `/schema/edit/${documentId}`,
                  )
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
              onClick={() =>
                createSchema.create({
                  user: authUser,
                  schema: document.schema,
                  stars: 0,
                  createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                  editedAt: firebase.firestore.FieldValue.serverTimestamp(),
                })
              }
            >
              Copy
            </Button>
            {isSameUser ? (
              <Button
                size="small"
                color="inherit"
                startIcon={<DeleteOutlineIcon />}
                onClick={() => {
                  remove(documentId);
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
      <LoadingBackdrop
        isLoading={isLoading || isRemoveLoading || createSchema.isLoading}
      />
      <Footer />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = withToken({
  redirect: true,
  getter: async ({ params, token }) => {
    const userId = token?.uid;
    const documentId = Array.isArray(params?.schemaId)
      ? undefined
      : params?.schemaId;

    if (!documentId || !userId) return { notFound: true };

    return { props: { documentId, userId } };
  },
});

import Container from "@material-ui/core/Container";
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
import { initializeFirebase } from "../../firebase/firebaseClient";
import useCreateDocument from "../../firebase/hooks/useCreateDocument";
import { ProjectCollection } from "../../firebase/types";
import ProjectSteps from "../../projects/components/steps/projectSteps";
import { ProjectDocument } from "../../projects/types";

initializeFirebase();

export default function ProjectCreate(): JSX.Element {
  const { authUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authUser) {
      router.push("/");
    }
  }, [authUser, router]);

  const collection = firebase.firestore().collection(ProjectCollection);
  const { create, state } = useCreateDocument<ProjectDocument>(collection);
  const documentId = state?.id;
  useEffect(() => {
    if (!documentId) return;
    router.push("/projects/[projectId]", `/projects/${documentId}`);
  }, [documentId, router]);

  if (!authUser) return <></>;

  return (
    <>
      <Header />
      <Container>
        <ProjectSteps
          onSubmit={doc =>
            create({
              ...doc,
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            })
          }
          authUser={authUser}
        />
      </Container>
      <Footer />
      <LoadingBackdrop isLoading={state.isLoading || state.isLoading} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = withToken({
  redirect: true,
});

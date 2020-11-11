import "firebase/firestore";

import Container from "@material-ui/core/Container";
import firebase from "firebase/app";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

import Footer from "../../components/common/footer";
import Header from "../../components/common/header";
import withAuthUser from "../../components/pageWrappers/withAuthUser";
import withAuthUserInfo from "../../components/pageWrappers/withAuthUserInfo";
import ProjectSteps from "../../components/projects/steps/projectSteps";
import { useAuthUserInfo } from "../../utils/auth/hooks";
import initFirebase from "../../utils/auth/initFirebase";
import { ProjectCollection } from "../../utils/firestore/types";
import useCreateDocument from "../../utils/firestore/useCreateDocument";
import { ProjectDocument } from "../../utils/projects/types";
import LoadingBackdrop from "../../components/common/loadingBackdrop";

initFirebase();

function ProjectCreate(): JSX.Element {
  const { authUser } = useAuthUserInfo();
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

export default withAuthUser(withAuthUserInfo(ProjectCreate));
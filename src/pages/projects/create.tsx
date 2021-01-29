import Container from "@material-ui/core/Container";
import firebase from "firebase/app";
import "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAuthUserInfo } from "../../auth/hooks";
import initFirebase from "../../auth/initFirebase";
import Footer from "../../common/components/footer";
import Header from "../../common/components/header";
import LoadingBackdrop from "../../common/components/loadingBackdrop";
import withAuthUser from "../../common/wrappers/withAuthUser";
import withAuthUserInfo from "../../common/wrappers/withAuthUserInfo";
import useCreateDocument from "../../firestore/hooks/useCreateDocument";
import { ProjectCollection } from "../../firestore/types";
import ProjectSteps from "../../projects/components/steps/projectSteps";
import { ProjectDocument } from "../../projects/types";

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

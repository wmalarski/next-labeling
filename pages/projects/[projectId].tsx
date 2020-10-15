import "firebase/firestore";

import firebase from "firebase/app";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

import Footer from "../../components/common/footer";
import Header from "../../components/common/header";
import LoadingBackdrop from "../../components/common/loadingBackdrop";
import withAuthUser from "../../components/pageWrappers/withAuthUser";
import withAuthUserInfo from "../../components/pageWrappers/withAuthUserInfo";
import { useAuthUserInfo } from "../../utils/auth/hooks";
import initFirebase from "../../utils/auth/initFirebase";
import { SchemaCollection } from "../../utils/firestore/types";
import useFetchDocument from "../../utils/firestore/useFetchDocument";
import { ProjectDocument } from "../../utils/projects/types";
import useFetchProject from "../../utils/projects/hooks/useFetchProject";

initFirebase();

function ProjectDetailsPage(): JSX.Element {
  const { authUser } = useAuthUserInfo();

  const router = useRouter();
  const { projectId: queryDocumentId } = router.query;
  const documentId = !Array.isArray(queryDocumentId)
    ? queryDocumentId
    : queryDocumentId[0];

  useEffect(() => {
    if (authUser) return;
    router.push("/");
  }, [authUser, router]);

  const { isLoading, exist } = useFetchProject(documentId);

  useEffect(() => {
    if (!isLoading && !exist) {
      router.push("/404");
    }
  }, [exist, isLoading, router]);

  if (!authUser) return <></>;

  return (
    <>
      <Header />
      <LoadingBackdrop isLoading={isLoading} />
      <Footer />
    </>
  );
}

export default withAuthUser(withAuthUserInfo(ProjectDetailsPage));

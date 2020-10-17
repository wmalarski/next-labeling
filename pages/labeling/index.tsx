import "firebase/firestore";

import Container from "@material-ui/core/Container";
import firebase from "firebase/app";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

import Footer from "../../components/common/footer";
import Header from "../../components/common/header";
import LabelingList from "../../components/labeling/labelingList";
import withAuthUser from "../../components/pageWrappers/withAuthUser";
import withAuthUserInfo from "../../components/pageWrappers/withAuthUserInfo";
import { useAuthUserInfo } from "../../utils/auth/hooks";
import initFirebase from "../../utils/auth/initFirebase";
import { LabelingCollection } from "../../utils/firestore/types";

initFirebase();

function LabelingListPage(): JSX.Element {
  const { authUser } = useAuthUserInfo();
  const router = useRouter();

  useEffect(() => {
    if (!authUser) {
      router.push("/");
    }
  });

  const db = firebase.firestore();
  const collection = db.collection(LabelingCollection);

  if (!authUser) return <></>;

  return (
    <>
      <Header />
      <Container>
        <LabelingList collection={collection} authUser={authUser} />
      </Container>
      <Footer />
    </>
  );
}

export default withAuthUser(withAuthUserInfo(LabelingListPage));

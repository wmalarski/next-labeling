import "firebase/firestore";

import Container from "@material-ui/core/Container";
import firebase from "firebase/app";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import Footer from "../../components/common/footer";
import Header from "../../components/common/header";
import SearchInput from "../../components/common/searchInput";
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

  const [searchText, setSearchText] = useState<string | null>(null);

  useEffect(() => {
    if (!authUser) {
      router.push("/");
    }
  });

  const collection = firebase.firestore().collection(LabelingCollection);
  const query = searchText
    ? collection.where("schema.name", "==", searchText)
    : collection;

  if (!authUser) return <></>;

  return (
    <>
      <Header>
        <SearchInput
          onSubmit={text => setSearchText(text.length ? text : null)}
        />
      </Header>
      <Container>
        <LabelingList query={query} authUser={authUser} />
      </Container>
      <Footer />
    </>
  );
}

export default withAuthUser(withAuthUserInfo(LabelingListPage));

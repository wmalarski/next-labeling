import Container from "@material-ui/core/Container";
import firebase from "firebase/app";
import "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAuthUserInfo } from "../../auth/hooks";
import initFirebase from "../../auth/initFirebase";
import Footer from "../../common/components/footer";
import Header from "../../common/components/header";
import SearchInput from "../../common/components/searchInput";
import withAuthUser from "../../common/wrappers/withAuthUser";
import withAuthUserInfo from "../../common/wrappers/withAuthUserInfo";
import { LabelingCollection } from "../../firestore/types";
import LabelingList from "../../labeling/components/labelingList";

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

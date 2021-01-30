import Container from "@material-ui/core/Container";
import firebase from "firebase/app";
import "firebase/firestore";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import withToken from "../../auth/functions/withToken";
import useAuth from "../../auth/hooks/useAuth";
import Footer from "../../common/components/footer";
import Header from "../../common/components/header";
import SearchInput from "../../common/components/searchInput";
import { LabelingCollection } from "../../firebase/types";
import LabelingList from "../../labeling/components/labelingList";

export default function LabelingListPage(): JSX.Element {
  const { authUser } = useAuth();
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

export const getServerSideProps: GetServerSideProps = withToken({
  redirect: true,
});
